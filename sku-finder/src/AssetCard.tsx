import { FC } from 'react';
import { Card } from '@frontify/fondue';
import { Checkbox } from '@frontify/fondue-components';

type AssetCardProps = {
  id: string;
  title?: string;
  previewUrl?: string;
  selected?: boolean;
  onToggle?: () => void;
  skus?: string[];
};

export const AssetCard: FC<AssetCardProps> = ({ title, previewUrl, selected = false, onToggle, skus = [] }) => {
  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onToggle?.();
    }
  };

  const skuText = skus.join(', ');

  return (
    <Card>
      <div
        role="button"
        aria-pressed={selected}
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={handleCardKeyDown}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        {/* Checkbox overlay — prevent bubbling */}
        <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }}>
          <Checkbox
            checked={selected}
            onChange={() => onToggle?.()}
            onClick={(e) => e.stopPropagation()}
            aria-label="Select asset"
          />
        </div>

        {previewUrl ? (
          <img
            src={previewUrl}
            alt={title}
            style={{
              width: '100%',
              height: 140,
              objectFit: 'cover',
              borderRadius: 6,
              marginBottom: 12,
              boxShadow: selected ? '0 0 0 3px rgba(59,130,246,0.7) inset' : 'none',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: 140,
              background: '#f0f0f0',
              borderRadius: 6,
              marginBottom: 12,
              boxShadow: selected ? '0 0 0 3px rgba(59,130,246,0.7) inset' : 'none',
            }}
          />
        )}

        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#1a1a1a',
            wordBreak: 'break-word',
            padding: '0 8px 2px',
          }}
        >
          {title || 'Untitled'}
        </div>

        {!!skuText && (
          <div
            title={skuText}
            style={{
              fontSize: 12,
              color: '#555',
              padding: '0 8px 8px',
              lineHeight: 1.3,
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {skuText}
          </div>
        )}
      </div>
    </Card>
  );
};
