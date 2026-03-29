import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UploadCloud, FileText, ScanLine, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReceiptUploaderProps {
  onScanComplete: (data: { amount: string; date: string; merchant: string }) => void;
}

export function ReceiptUploader({ onScanComplete }: ReceiptUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      startScan(e.target.files[0])
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      startScan(e.dataTransfer.files[0])
    }
  }

  const startScan = (selectedFile: File) => {
    setFile(selectedFile)
    setScanning(true)
    setProgress(0)

    // Simulate Tesseract.js progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + 15
      })
    }, 400)

    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => {
        setScanning(false)
        onScanComplete({
          amount: "1,245.50",
          date: new Date().toISOString().split('T')[0],
          merchant: "Acme Corp Services",
        })
      }, 500)
    }, 3000)
  }

  return (
    <div 
      className={`border-2 border-dashed rounded-xl transition-all duration-300 ${
        file ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'
      }`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center min-h-[300px] relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center"
            >
              <div 
                className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Scan Receipt</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                Drag and drop your receipt here, or click to browse. We'll automatically extract the details using AI.
              </p>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="h-10 px-6 font-medium">
                Browse Files
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
              
              <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> JPEG, PNG, PDF</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Up to 10MB</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-sm mx-auto flex flex-col items-center z-10"
            >
              <div className="w-16 h-16 bg-background rounded-2xl shadow-sm border flex items-center justify-center mb-4 relative overflow-hidden">
                <FileText className="w-8 h-8 text-muted-foreground" />
                {scanning && (
                  <motion.div 
                    initial={{ y: "-100%" }}
                    animate={{ y: "100%" }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/30 to-transparent"
                  />
                )}
              </div>
              
              <h3 className="text-lg font-semibold truncate w-full px-4 mb-2">{file.name}</h3>
              
              {scanning ? (
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="flex items-center gap-2 text-primary">
                      <ScanLine className="w-4 h-4 animate-pulse" /> AI Extraction in progress...
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "easeOut" }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-success font-medium bg-success/10 px-4 py-2 rounded-full mt-2">
                  <CheckCircle2 className="w-5 h-5" /> Data extracted successfully
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
