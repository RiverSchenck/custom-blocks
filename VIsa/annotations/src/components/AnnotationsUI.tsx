import {
    CloseOutlined,
    DeleteOutlined,
    DownOutlined,
    PictureOutlined,
    PlusOutlined,
    SwapOutlined,
} from '@ant-design/icons';
import { type AppBridgeBlock } from '@frontify/app-bridge';
import { PluginComposer } from '@frontify/fondue';
import { BlockItemWrapper, LinkPlugin, ParagraphPlugin, RichTextEditor } from '@frontify/guideline-blocks-settings';
import { Button, Dropdown, type MenuProps } from 'antd';
import { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { type Annotation, type AnnotationArea } from '../types';

type ImageAsset = { id: number; previewUrl: string; title: string };

function getAreaForImage(
    ann: Annotation,
    imageId: number,
    firstImageId: number | undefined,
): AnnotationArea | undefined {
    const byId = ann.areasByImageId?.[String(imageId)];
    if (byId) {
        return byId;
    }
    if (firstImageId !== undefined && imageId === firstImageId && ann.area) {
        return ann.area;
    }
    return undefined;
}

const DEFAULT_AREA: AnnotationArea = { x: 35, y: 35, width: 20, height: 20 };
const PERSIST_DEBOUNCE_MS = 400;

const EMPTY_RICH_VALUE = JSON.stringify([{ type: 'p', children: [{ text: '' }] }]);

function toEditorValue(s: string): string {
    if (!s) {
        return EMPTY_RICH_VALUE;
    }
    try {
        const parsed = JSON.parse(s) as unknown;
        if (Array.isArray(parsed)) {
            return s;
        }
    } catch {
        // fallthrough
    }
    return JSON.stringify([{ type: 'p', children: [{ text: s }] }]);
}

const DEFAULT_HIGHLIGHT_STYLE = {
    border: '#2563eb',
    fill: 'rgba(37, 99, 235, 0.2)',
};

const DEFAULT_CIRCLE_STYLE = {
    backgroundColor: '#e5e7eb',
    color: '#374151',
};

export type AnnotationsUIProps = {
    appBridge: AppBridgeBlock;
    annotations: Annotation[];
    onAnnotationsChange: (next: Annotation[]) => void;
    imageAssets?: ImageAsset[] | null;
    onAddImage?: () => void;
    onRemoveImage?: (index: number) => void;
    onChangeImage?: (index: number) => void;
    isEdit: boolean;
    highlightStyle?: { border: string; fill: string };
    circleStyle?: { backgroundColor: string; color: string };
};

function toAreasByImageId(ann: Annotation, firstImageId: number | undefined): Record<string, AnnotationArea> {
    if (ann.areasByImageId) {
        return ann.areasByImageId;
    }
    if (firstImageId !== undefined && firstImageId !== null && ann.area) {
        return { [String(firstImageId)]: ann.area };
    }
    return {};
}

export const AnnotationsUI: FC<AnnotationsUIProps> = ({
    appBridge,
    annotations,
    onAnnotationsChange,
    imageAssets = null,
    onAddImage,
    onRemoveImage,
    onChangeImage,
    isEdit,
    highlightStyle = DEFAULT_HIGHLIGHT_STYLE,
    circleStyle = DEFAULT_CIRCLE_STYLE,
}) => {
    const linkOnlyPlugins = useMemo(
        () => new PluginComposer().setPlugin(new ParagraphPlugin(), new LinkPlugin({ appBridge })),
        [appBridge],
    );
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [localTextById, setLocalTextById] = useState<Record<string, string>>({});
    const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const localTextRef = useRef<Record<string, string>>({});
    const annotationsRef = useRef<Annotation[]>(annotations);
    const [dragging, setDragging] = useState<{
        id: string;
        imageId: number;
        startX: number;
        startY: number;
        areaX: number;
        areaY: number;
    } | null>(null);
    const imageContainerRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const firstImageId = imageAssets?.[0]?.id;

    annotationsRef.current = annotations;
    localTextRef.current = localTextById;

    const persistTexts = useCallback(() => {
        const merged = annotationsRef.current.map((a) => ({
            ...a,
            text: localTextRef.current[a.id] ?? a.text,
        }));
        onAnnotationsChange(merged);
    }, [onAnnotationsChange]);

    useEffect(() => {
        return () => {
            if (persistTimerRef.current) {
                clearTimeout(persistTimerRef.current);
            }
        };
    }, []);

    const schedulePersist = useCallback(() => {
        if (persistTimerRef.current) {
            clearTimeout(persistTimerRef.current);
        }
        persistTimerRef.current = setTimeout(() => {
            persistTimerRef.current = null;
            persistTexts();
        }, PERSIST_DEBOUNCE_MS);
    }, [persistTexts]);

    const addAnnotation = useCallback(() => {
        const next: Annotation = {
            id: crypto.randomUUID(),
            text: EMPTY_RICH_VALUE,
            areasByImageId: {},
        };
        onAnnotationsChange([...annotations, next]);
    }, [annotations, onAnnotationsChange]);

    const removeAnnotation = useCallback(
        (id: string) => {
            setLocalTextById((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
            onAnnotationsChange(annotations.filter((a) => a.id !== id));
        },
        [annotations, onAnnotationsChange],
    );

    const updateAnnotationText = useCallback(
        (id: string, text: string) => {
            setLocalTextById((prev) => ({ ...prev, [id]: text }));
            schedulePersist();
        },
        [schedulePersist],
    );

    const addArea = useCallback(
        (id: string, imageId: number) => {
            const a = annotations.find((x) => x.id === id);
            if (!a) {
                return;
            }
            const areas = toAreasByImageId(a, firstImageId);
            if (areas[String(imageId)]) {
                return;
            }
            const nextAreas = { ...areas, [String(imageId)]: { ...DEFAULT_AREA } };
            onAnnotationsChange(
                annotations.map((x) => (x.id === id ? { ...x, areasByImageId: nextAreas, area: undefined } : x)),
            );
        },
        [annotations, onAnnotationsChange, firstImageId],
    );

    const removeArea = useCallback(
        (id: string, imageId: number) => {
            const a = annotations.find((x) => x.id === id);
            if (!a) {
                return;
            }
            const areas = { ...toAreasByImageId(a, firstImageId) };
            delete areas[String(imageId)];
            onAnnotationsChange(
                annotations.map((x) => (x.id === id ? { ...x, areasByImageId: areas, area: undefined } : x)),
            );
        },
        [annotations, onAnnotationsChange, firstImageId],
    );

    const updateAreaPosition = useCallback(
        (id: string, imageId: number, x: number, y: number) => {
            const a = annotations.find((x) => x.id === id);
            const area = a ? getAreaForImage(a, imageId, firstImageId) : undefined;
            if (!area) {
                return;
            }
            const nx = Math.max(0, Math.min(100 - area.width, x));
            const ny = Math.max(0, Math.min(100 - area.height, y));
            const areas = a ? toAreasByImageId(a, firstImageId) : {};
            const nextAreas = {
                ...areas,
                [String(imageId)]: { ...area, x: nx, y: ny },
            };
            onAnnotationsChange(
                annotations.map((x) => (x.id === id ? { ...x, areasByImageId: nextAreas, area: undefined } : x)),
            );
        },
        [annotations, onAnnotationsChange, firstImageId],
    );

    const handleAreaMouseDown = useCallback(
        (e: React.MouseEvent, id: string, imageId: number) => {
            if (!isEdit) {
                return;
            }
            const a = annotations.find((x) => x.id === id);
            const area = a ? getAreaForImage(a, imageId, firstImageId) : undefined;
            if (!area) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            setDragging({
                id,
                imageId,
                startX: e.clientX,
                startY: e.clientY,
                areaX: area.x,
                areaY: area.y,
            });
        },
        [isEdit, annotations, firstImageId],
    );

    useEffect(() => {
        if (!dragging) {
            return;
        }
        const onMove = (e: MouseEvent) => {
            const el = imageContainerRefs.current[dragging.imageId];
            const rect = el?.getBoundingClientRect();
            if (!rect) {
                return;
            }
            const dx = ((e.clientX - dragging.startX) / rect.width) * 100;
            const dy = ((e.clientY - dragging.startY) / rect.height) * 100;
            updateAreaPosition(dragging.id, dragging.imageId, dragging.areaX + dx, dragging.areaY + dy);
        };
        const onUp = () => setDragging(null);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
    }, [dragging, updateAreaPosition]);

    const hasImages = (imageAssets?.length ?? 0) > 0;
    const showRightColumn = (isEdit && ((onAddImage !== undefined && onAddImage !== null) || hasImages)) || hasImages;

    return (
        <div className="tw-w-full tw-py-2">
            <div className="tw-grid tw-grid-cols-1 tw-gap-6 lg:tw-grid-cols-[minmax(18rem,1fr)_minmax(22rem,1.25fr)] lg:tw-items-start">
                <div className="tw-min-w-0">
                    <ul className="tw-list-none tw-pl-0 tw-m-0 tw-space-y-2">
                        {annotations.map((ann, index) => (
                            <li
                                key={ann.id}
                                className="tw-flex tw-items-center tw-gap-3 tw-py-2 tw-px-3 tw-rounded-lg tw-transition-colors hover:tw-bg-gray-50"
                                onMouseEnter={!isEdit ? () => setHoveredId(ann.id) : undefined}
                                onMouseLeave={!isEdit ? () => setHoveredId(null) : undefined}
                            >
                                <span
                                    className="tw-flex tw-items-center tw-justify-center tw-text-sm tw-font-medium tw-shrink-0"
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        backgroundColor: circleStyle.backgroundColor,
                                        color: circleStyle.color,
                                    }}
                                    aria-hidden
                                >
                                    {index + 1}
                                </span>
                                <div className="tw-flex-1 tw-min-w-0">
                                    <RichTextEditor
                                        isEditing={isEdit}
                                        value={toEditorValue(
                                            localTextById[ann.id] !== undefined ? localTextById[ann.id] : ann.text,
                                        )}
                                        placeholder="Annotation text"
                                        plugins={linkOnlyPlugins}
                                        onTextChange={(value) => {
                                            updateAnnotationText(ann.id, value);
                                        }}
                                    />
                                </div>
                                {isEdit && (
                                    <div className="tw-flex tw-items-center tw-gap-1 tw-shrink-0">
                                        {(() => {
                                            const imagesWithoutArea = (imageAssets ?? []).filter(
                                                (asset) => !getAreaForImage(ann, asset.id, firstImageId),
                                            );
                                            if (imagesWithoutArea.length === 0) {
                                                return null;
                                            }
                                            if (imagesWithoutArea.length === 1) {
                                                return (
                                                    <button
                                                        type="button"
                                                        onClick={() => addArea(ann.id, imagesWithoutArea[0].id)}
                                                        className="tw-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-rounded tw-border tw-border-transparent tw-transition-colors hover:tw-bg-gray-200"
                                                        title="Add highlight on image"
                                                        aria-label="Add highlight on image"
                                                    >
                                                        <PlusOutlined className="tw-text-gray-600" />
                                                    </button>
                                                );
                                            }
                                            const menuItems: MenuProps['items'] = imagesWithoutArea.map((asset, i) => ({
                                                key: asset.id,
                                                label: `Add to image ${i + 1}`,
                                                onClick: () => addArea(ann.id, asset.id),
                                            }));
                                            return (
                                                <Dropdown
                                                    menu={{ items: menuItems }}
                                                    trigger={['click']}
                                                    placement="bottomRight"
                                                >
                                                    <button
                                                        type="button"
                                                        className="tw-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-rounded tw-border tw-border-transparent tw-transition-colors hover:tw-bg-gray-200"
                                                        title="Add highlight on an image"
                                                        aria-label="Add highlight on an image"
                                                    >
                                                        <PlusOutlined className="tw-text-gray-600" />
                                                        <DownOutlined className="tw-text-xs tw-ml-0.5" />
                                                    </button>
                                                </Dropdown>
                                            );
                                        })()}
                                        <button
                                            type="button"
                                            onClick={() => removeAnnotation(ann.id)}
                                            className="tw-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-rounded tw-border tw-border-transparent tw-transition-colors hover:tw-bg-red-50 hover:tw-text-red-600"
                                            title="Remove annotation"
                                            aria-label="Remove annotation"
                                        >
                                            <CloseOutlined className="tw-text-gray-600" />
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    {isEdit && (
                        <div className="tw-mt-3">
                            <Button type="dashed" icon={<PlusOutlined />} onClick={addAnnotation} className="tw-w-full">
                                Add annotation
                            </Button>
                        </div>
                    )}
                </div>

                {showRightColumn ? (
                    <div className="tw-w-full tw-min-w-0 tw-flex tw-flex-col tw-gap-3">
                        {(!imageAssets?.length || (isEdit && onAddImage)) && isEdit && onAddImage ? (
                            <Button
                                type="default"
                                icon={<PictureOutlined />}
                                onClick={onAddImage}
                                className="tw-w-full"
                            >
                                {imageAssets?.length ? 'Add image' : 'Select image'}
                            </Button>
                        ) : null}
                        {imageAssets?.length
                            ? imageAssets.map((asset, assetIndex) => {
                                  const imageContent = (
                                      <div
                                          ref={(el) => {
                                              imageContainerRefs.current[asset.id] = el;
                                          }}
                                          className="tw-relative tw-w-full tw-h-full tw-min-h-[12rem] tw-rounded-lg tw-overflow-hidden tw-bg-gray-50"
                                      >
                                          <img
                                              src={asset.previewUrl}
                                              alt={asset.title || 'Asset'}
                                              className="tw-block tw-w-full tw-h-full tw-max-h-64 tw-object-contain tw-rounded-lg tw-border tw-border-gray-200"
                                              draggable={false}
                                          />
                                          <div
                                              className="tw-absolute tw-inset-0"
                                              style={{
                                                  pointerEvents: 'none',
                                              }}
                                              aria-hidden
                                          >
                                              {annotations.map((ann) => {
                                                  const area = getAreaForImage(ann, asset.id, firstImageId);
                                                  const show = isEdit || (hoveredId === ann.id && area);
                                                  if (!show || !area) {
                                                      return null;
                                                  }
                                                  const isHover = !isEdit && hoveredId === ann.id;
                                                  const AreaWrapper = isEdit ? 'button' : 'div';
                                                  return (
                                                      <AreaWrapper
                                                          key={ann.id}
                                                          type={isEdit ? 'button' : undefined}
                                                          aria-label={
                                                              isEdit ? 'Highlight area; drag to move' : undefined
                                                          }
                                                          className="tw-absolute tw-transition-opacity tw-text-left"
                                                          style={{
                                                              left: `${area.x}%`,
                                                              top: `${area.y}%`,
                                                              width: `${area.width}%`,
                                                              height: `${area.height}%`,
                                                              border: `2px solid ${
                                                                  isHover ? highlightStyle.border : 'rgba(0,0,0,0.4)'
                                                              }`,
                                                              backgroundColor: isHover
                                                                  ? highlightStyle.fill
                                                                  : 'rgba(0,0,0,0.1)',
                                                              borderRadius: 4,
                                                              pointerEvents: isEdit ? 'auto' : 'none',
                                                              ...(isEdit && {
                                                                  padding: 0,
                                                                  margin: 0,
                                                                  cursor: 'move',
                                                              }),
                                                          }}
                                                          onMouseDown={
                                                              isEdit
                                                                  ? (e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleAreaMouseDown(e, ann.id, asset.id);
                                                                    }
                                                                  : undefined
                                                          }
                                                      >
                                                          {isEdit && (
                                                              <button
                                                                  type="button"
                                                                  className="tw-absolute tw-top-1 tw-right-1 tw-w-5 tw-h-5 tw-flex tw-items-center tw-justify-center tw-rounded tw-bg-red-500 tw-text-white tw-text-xs hover:tw-bg-red-600"
                                                                  style={{
                                                                      pointerEvents: 'auto',
                                                                  }}
                                                                  onMouseDown={(e) => {
                                                                      e.preventDefault();
                                                                      e.stopPropagation();
                                                                  }}
                                                                  onClick={(e) => {
                                                                      e.preventDefault();
                                                                      e.stopPropagation();
                                                                      removeArea(ann.id, asset.id);
                                                                  }}
                                                                  aria-label="Remove highlight from this image"
                                                              >
                                                                  <CloseOutlined />
                                                              </button>
                                                          )}
                                                      </AreaWrapper>
                                                  );
                                              })}
                                          </div>
                                      </div>
                                  );
                                  const toolbarItems = [
                                      ...(onChangeImage
                                          ? [
                                                {
                                                    type: 'button' as const,
                                                    icon: <SwapOutlined />,
                                                    tooltip: 'Change image',
                                                    onClick: () => onChangeImage(assetIndex),
                                                },
                                            ]
                                          : []),
                                      ...(onRemoveImage
                                          ? [
                                                {
                                                    type: 'button' as const,
                                                    icon: <DeleteOutlined />,
                                                    tooltip: 'Delete image',
                                                    onClick: () => onRemoveImage(assetIndex),
                                                },
                                            ]
                                          : []),
                                  ];
                                  return (
                                      <div key={asset.id} className="tw-space-y-1">
                                          {isEdit && (onRemoveImage || onChangeImage) && toolbarItems.length > 0 ? (
                                              <div
                                                  className="tw-w-full tw-flex"
                                                  style={{
                                                      minHeight: 200,
                                                  }}
                                              >
                                                  <BlockItemWrapper shouldFillContainer toolbarItems={toolbarItems}>
                                                      {imageContent}
                                                  </BlockItemWrapper>
                                              </div>
                                          ) : (
                                              imageContent
                                          )}
                                      </div>
                                  );
                              })
                            : null}
                    </div>
                ) : null}
            </div>
        </div>
    );
};
