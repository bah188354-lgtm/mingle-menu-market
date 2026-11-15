import { useRef, useState, type DragEvent } from "react";
import { ImagePlus, Loader2, RefreshCw, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { menuImages, menuImage } from "@/lib/menu-images";
import { compressMenuPhoto, menuPhotoUrl, MENU_PHOTO_BUCKET, MENU_PHOTO_MAX_BYTES } from "@/lib/menu-photo";

const presetLabels: Record<string, string> = { espresso: "Espresso", flatwhite: "Flat white", icedlatte: "Buzlu", frappe: "Frappe" };

export function PhotoUploader({ value, onChange, onBusyChange }: { value: string; onChange: (image: string) => void; onBusyChange?: (busy: boolean) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const isPreset = Boolean(menuImages[value]);

  async function upload(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Lütfen bir fotoğraf seçin."); return; }
    if (file.size > MENU_PHOTO_MAX_BYTES) { toast.error("Fotoğraf en fazla 15 MB olabilir."); return; }
    setUploading(true); onBusyChange?.(true);
    try {
      const blob = await compressMenuPhoto(file);
      const name = `${crypto.randomUUID()}.jpg`;
      const { error } = await supabase.storage.from(MENU_PHOTO_BUCKET).upload(name, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
      if (error) throw error;
      onChange(menuPhotoUrl(name));
      toast.success("Fotoğraf yüklendi.");
    } catch {
      toast.error("Fotoğraf yüklenemedi, tekrar deneyin.");
    } finally {
      setUploading(false); onBusyChange?.(false);
      if (input.current) input.current.value = "";
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault(); setDragging(false);
    void upload(e.dataTransfer.files?.[0]);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm">Fotoğraf</p>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${dragging ? "border-primary bg-primary/10" : "border-border"}`}
      >
        <img src={menuImage(value)} alt="Seçilen fotoğraf" className="aspect-[4/3] w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-3">
          <span className="text-xs text-muted-foreground">{uploading ? "Yükleniyor..." : isPreset ? "Hazır fotoğraf · sürükleyip bırakabilirsiniz" : "Sizin fotoğrafınız"}</span>
          <Button type="button" size="sm" disabled={uploading} onClick={() => input.current?.click()}>
            {uploading ? <Loader2 className="animate-spin" /> : isPreset ? <ImagePlus /> : <RefreshCw />}
            {isPreset ? "Fotoğraf yükle" : "Değiştir"}
          </Button>
        </div>
        {uploading && <div className="absolute inset-0 flex items-center justify-center bg-overlay backdrop-blur-sm"><Loader2 className="size-8 animate-spin text-primary" /></div>}
      </div>
      <input ref={input} type="file" accept="image/*" aria-label="Fotoğraf yükle" className="sr-only" onChange={(e) => void upload(e.target.files?.[0])} />
      <div>
        <p className="mb-2 text-xs text-muted-foreground">veya hazır bir fotoğraf seçin</p>
        <div className="flex gap-2">
          {Object.entries(menuImages).map(([key, image]) => (
            <button key={key} type="button" aria-label={`${presetLabels[key] ?? key} fotoğrafı`} onClick={() => onChange(key)}
              className={`relative size-14 overflow-hidden rounded-xl transition ${value === key ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-70 hover:opacity-100"}`}>
              <img alt="" src={image} className="size-full object-cover" />
              {value === key && <span className="absolute inset-0 flex items-center justify-center bg-overlay"><Check className="size-4 text-primary" /></span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
