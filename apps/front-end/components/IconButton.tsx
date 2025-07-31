
export function IconButton({
    icon, onClick,activated
}: {
    icon: React.ReactNode;
    onClick: () => void;
    activated?: boolean;
}) {
    return (
        <button onClick={onClick}
            className={`cursor-pointer rounded-full border p-2 transition-colors duration-200
                ${activated ? 'bg-white text-black' : 'bg-black text-white hover:text-red-400'}
            `}
            >
            {icon}
        </button>
    );
}