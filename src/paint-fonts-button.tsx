import React from 'react';

const title = {id: 'tw.fonts.title', defaultMessage: 'Fonts'};

export default function PaintFontsButton({intl, onOpen}: {
    intl: {formatMessage(message: typeof title): string};
    onOpen?: () => void;
}) {
    if (!onOpen) return null;
    return <button type="button" className="tw-paint-fonts-button" aria-haspopup="dialog" onClick={onOpen}>
        {intl.formatMessage(title)}…
    </button>;
}
