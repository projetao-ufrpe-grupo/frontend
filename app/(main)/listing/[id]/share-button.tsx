import { useRef, useState, useEffect, useMemo } from 'react';
import { Copy, Mail, Link2, Share2, MessageCircle, Send } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';

type ShareButtonProps = {
  url?: string;
  title?: string;
  text?: string;
  buttonClassName?: string;
  buttonLabel?: string;
};

type ShareOption = {
  name: string;
  icon: React.ReactNode;
  action: () => void;
};

export function ShareButton({
  url,
  title = typeof document !== 'undefined' ? document.title : '',
  text = 'Check this out:',
  buttonClassName = "w-full h-12 px-4 rounded-2xl flex items-center justify-center gap-2 font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 text-base",
  buttonLabel = 'Share',
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const inputRef = useRef<HTMLInputElement>(null);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copyToClipboard = async () => {
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);

    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      inputRef.current?.select();
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = currentUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        const successful = document.execCommand?.('copy');
        document.body.removeChild(textArea);

        if (!successful) throw new Error('Fallback copy failed');
        setCopied(true);
        copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Copy failed:', fallbackErr);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const shareOptions = useMemo<ShareOption[]>(() => [
    {
      name: 'WhatsApp',
      icon: <MessageCircle size={20} className="text-[#25D366]" />,
      action: () =>
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${currentUrl}`)}`),
    },
    {
      name: 'Telegram',
      icon: <Send size={20} className="text-[#0088cc]" />,
      action: () =>
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(
            text
          )}`
        ),
    },
    {
      name: 'Email',
      icon: <Mail size={20} />,
      action: () =>
        window.open(
          `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
            `${text}\n\n${currentUrl}`
          )}`
        ),
    },
    {
      name: 'Copy',
      icon: <Link2 size={20} />,
      action: copyToClipboard,
    },
  ], [currentUrl, text, title]);

  const handleShareClick = async (e: React.MouseEvent) => {
    if (navigator.share) {
      e.preventDefault();
      try {
        await navigator.share({ title, text, url: currentUrl });
        return;
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          onClick={handleShareClick}
          className={buttonClassName}
          aria-haspopup="true"
          aria-label="Share options"
        >
          <Share2 size={18} />
          {buttonLabel}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="z-50 w-72 p-4 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        side="top"
        align="center"
        sideOffset={8}
      >
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Share via</p>

          <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
            <input
              ref={inputRef}
              type="text"
              value={currentUrl}
              readOnly
              className="flex-1 text-xs bg-transparent truncate outline-none dark:text-gray-200"
              onClick={(e) => (e.target as HTMLInputElement).select()}
              aria-label="Shareable URL"
            />
            <button
              onClick={copyToClipboard}
              className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
              aria-label={copied ? 'Copied!' : 'Copy link'}
              title={copied ? 'Copied!' : 'Copy link'}
            >
              <Copy size={16} className={copied ? 'text-green-600 dark:text-green-400' : ''} />
              <span
                className={`text-xs text-green-600 dark:text-green-400 transition-opacity duration-300 ${
                  copied ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Copied!
              </span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={option.action}
                className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title={`Share via ${option.name}`}
                aria-label={`Share via ${option.name}`}
              >
                {option.icon}
                <span className="text-xs mt-1 dark:text-gray-200">{option.name}</span>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}