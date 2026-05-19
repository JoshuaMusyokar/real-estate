interface Props {
  token: string;
  onClick?: () => void;
}

export const TokenBadge: React.FC<Props> = ({ token, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    title={onClick ? `Insert {{${token}}}` : undefined}
    className={`inline-flex items-center font-mono text-[10px] sm:text-[11px] px-1.5 py-0.5
      bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400
      border border-blue-200 dark:border-blue-800 rounded
      ${onClick ? "hover:bg-blue-100 dark:hover:bg-blue-900/40 cursor-pointer transition-colors" : "cursor-default"}`}
  >
    {`{{${token}}}`}
  </button>
);
