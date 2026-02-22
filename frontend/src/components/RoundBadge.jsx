export default function RoundBadge({ text }) {
    return (
        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold tracking-wide uppercase border border-slate-200 shadow-sm inline-block">
            {text}
        </span>
    );
}
