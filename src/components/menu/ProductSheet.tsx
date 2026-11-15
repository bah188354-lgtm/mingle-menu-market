import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Heart, X, Maximize2 } from "lucide-react";

export type ProductDetail = { id: string; name: string; categoryName?: string | undefined; price: number; old?: number | undefined; img: string; desc: string };

const roundButton = "flex size-11 items-center justify-center rounded-full bg-overlay text-foreground backdrop-blur-md transition hover:scale-105";

export function ProductSheet({ item, fav, onToggleFav, onClose }: { item: ProductDetail | null; fav: boolean; onToggleFav: () => void; onClose: () => void }) {
  const [zoom, setZoom] = useState(false);
  useEffect(() => { setZoom(false); }, [item?.id]);
  const discount = item?.old ? Math.round((1 - item.price / item.old) * 100) : 0;

  return (
    <DialogPrimitive.Root open={item !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-overlay backdrop-blur-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onEscapeKeyDown={(e) => { if (zoom) { e.preventDefault(); setZoom(false); } }}
          className="fixed inset-0 z-50 mx-auto flex w-full max-w-lg flex-col overflow-hidden bg-background outline-none sm:inset-y-6 sm:rounded-[2rem] data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-10 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-10"
        >
          {item && <>
            <div className="relative h-[62%] shrink-0">
              <button type="button" onClick={() => setZoom(true)} aria-label="Fotoğrafı tam ekran aç" className="block size-full overflow-hidden">
                <img src={item.img} alt={item.name} className="product-photo size-full object-cover" />
              </button>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-overlay via-transparent to-background" />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                <DialogPrimitive.Close aria-label="Kapat" className={roundButton}><X className="size-5" /></DialogPrimitive.Close>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setZoom(true)} aria-label="Tam ekran" className={roundButton}><Maximize2 className="size-4" /></button>
                  <button type="button" onClick={onToggleFav} aria-label="Favori" className={roundButton}><Heart className={`size-5 ${fav ? "fill-primary text-primary" : ""}`} /></button>
                </div>
              </div>
              {discount > 0 && <span className="absolute bottom-6 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">%{discount} indirim</span>}
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-8 pt-1">
              {item.categoryName && <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">{item.categoryName}</p>}
              <DialogPrimitive.Title className="mt-2 text-3xl font-semibold leading-tight">{item.name}</DialogPrimitive.Title>
              {item.desc && <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{item.desc}</p>}
              <div className="mt-6 rounded-3xl bg-card p-5">
                <p className="text-xs text-muted-foreground">Fiyat</p>
                <p className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-primary">{item.price} Birr</span>
                  {item.old && <span className="text-sm text-muted-foreground line-through">{item.old} Birr</span>}
                </p>
              </div>
            </div>
            {zoom && (
              <div className="photo-lightbox fixed inset-0 z-[60] flex items-center justify-center animate-in fade-in-0 zoom-in-95" onClick={() => setZoom(false)}>
                <img src={item.img} alt={item.name} className="max-h-full max-w-full object-contain" />
                <button type="button" aria-label="Tam ekranı kapat" onClick={() => setZoom(false)} className={`absolute right-4 top-4 ${roundButton}`}><X className="size-5" /></button>
              </div>
            )}
          </>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
