import { XIcon } from "lucide-react";

export function SimpleModal({open, setOpen, content, title}: { open: boolean, setOpen: (value: boolean) => void; content: React.JSX.Element, title: string }) {
  
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl py-6 w-full max-w-lg shadow-lg">
           <div className="flex flex-row px-6 items-center justify-between">
             <h2 className="text-lg font-semibold mb-2">{title}</h2>
             <button onClick={() => setOpen(false)}>  <XIcon /></button>
           </div>
            {content}
          </div>
        </div>
      )}
    </>
  )
}
