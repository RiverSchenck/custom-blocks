import { Quill } from 'react-quill';

const Link = Quill.import('formats/link');

Link.PROTOCOL_WHITELIST = ['http', 'https', 'mailto', 'tel', 'radar', 'rdar', 'smb', 'sms'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class CustomLinkSanitizer extends (Link as any) {
    static sanitize(url: string): string | undefined {
        const sanitizedUrl = super.sanitize(url);

        if (!sanitizedUrl || sanitizedUrl === 'about:blank') {
            return sanitizedUrl;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const hasWhitelistedProtocol = (this as any).PROTOCOL_WHITELIST.some((protocol: string) => {
            return sanitizedUrl.startsWith(protocol);
        });

        const emailRegex = /\S+@\S+\.\S+/;

        if (emailRegex.test(url) && !url.startsWith('mailto:')) {
            // The url is an email address but does not start with 'mailto:', so add it
            return `mailto:${sanitizedUrl}`;
        } else if (hasWhitelistedProtocol) {
            // The url starts with a whitelisted protocol, so return as is
            return sanitizedUrl;
            // eslint-disable-next-line unicorn/no-unsafe-regex
        } else if (/^\+?\d{1,4}?[\s.-]?\(?(?:\d{1,3}?\)?[\s.-]?)?\d{1,4}[\s.-]?\d{1,9}$/.test(sanitizedUrl)) {
            return `tel:${sanitizedUrl}`;
        }

        // Default to adding 'http://' to the start of the url
        return `http://${sanitizedUrl}`;
    }
}

Quill.register(CustomLinkSanitizer, true);
