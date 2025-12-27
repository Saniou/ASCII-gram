"use client"

import type React from "react"

import { useState, useEffect, useRef, type ChangeEvent } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { GripVertical, Upload, Download } from "lucide-react"
import BackArrow from "@/components/back-arrow"
import Header from "@/components/header"
import BackgroundAscii from "@/components/backgroundAscii"

// Define a type for colored ASCII characters
type ColoredChar = {
    char: string
    color: string
}

export default function AsciiConverter() {
    // Add this at the beginning of the component, right after the imports
    useEffect(() => {
        // Set document background to black
        if (typeof document !== "undefined") {
            document.documentElement.style.backgroundColor = "black"
            document.body.style.backgroundColor = "black"
        }

        return () => {
            // Clean up when component unmounts
            if (typeof document !== "undefined") {
                document.documentElement.style.backgroundColor = ""
                document.body.style.backgroundColor = ""
            }
        }
    }, [])
    const [resolution, setResolution] = useState(0.11)
    const [inverted, setInverted] = useState(false)
    const [grayscale, setGrayscale] = useState(true)
    const [charSet, setCharSet] = useState("standard")
    const [loading, setLoading] = useState(true)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [asciiArt, setAsciiArt] = useState<string>("")
    const [coloredAsciiArt, setColoredAsciiArt] = useState<ColoredChar[][]>([])
    const [leftPanelWidth, setLeftPanelWidth] = useState(25) // percentage
    const [isDragging, setIsDragging] = useState(false)
    const [isDraggingFile, setIsDraggingFile] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isDesktop, setIsDesktop] = useState(false)
    const [isHydrated, setIsHydrated] = useState(false)
    const [sidebarNarrow, setSidebarNarrow] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imageRef = useRef<HTMLImageElement | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const previewRef = useRef<HTMLDivElement>(null)
    // Add a new ref for the output canvas
    const outputCanvasRef = useRef<HTMLCanvasElement>(null)

    const charSets = {
        standard: " .:-=+*#%@",
        detailed: " .,:;i1tfLCG08@",
        blocks: " ░▒▓█",
        minimal: " .:█",
    }

    // Set hydration state
    useEffect(() => {
        setIsHydrated(true)
    }, [])

    useEffect(() => {
        if (!isHydrated) return

        // Check if we're on the client side
        setIsDesktop(window.innerWidth >= 768)

        // Add resize listener
        const handleResize = () => {
            const newIsDesktop = window.innerWidth >= 768
            setIsDesktop(newIsDesktop)

            // Reset panel width if switching between mobile and desktop
            if (newIsDesktop !== isDesktop) {
                setLeftPanelWidth(25) // Reset to default when switching layouts
            }
        }

        window.addEventListener("resize", handleResize)

        // Load default image
        loadDefaultImage()

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [isDesktop, isHydrated])

    // Check if sidebar is narrow
    useEffect(() => {
        if (!isHydrated || !isDesktop) return

        // Check if sidebar is narrow (less than 200px)
        const checkSidebarWidth = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth
                const sidebarWidth = (leftPanelWidth / 100) * containerWidth
                setSidebarNarrow(sidebarWidth < 350)
            }
        }

        checkSidebarWidth()

        // Add resize listener to check sidebar width
        window.addEventListener("resize", checkSidebarWidth)

        return () => {
            window.removeEventListener("resize", checkSidebarWidth)
        }
    }, [leftPanelWidth, isHydrated, isDesktop])

    useEffect(() => {
        if (imageLoaded && imageRef.current) {
            convertToAscii()
        }
    }, [resolution, inverted, grayscale, charSet, imageLoaded])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect()
                const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

                // Limit the minimum width of each panel to 20%
                if (newLeftWidth >= 20 && newLeftWidth <= 80) {
                    setLeftPanelWidth(newLeftWidth)
                }
            }
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
        }
    }, [isDragging])

    const startDragging = () => {
        setIsDragging(true)
    }

    const loadDefaultImage = () => {
        setLoading(true)
        setError(null)
        setImageLoaded(false)

        // Create a new image element
        const img = new Image()
        img.crossOrigin = "anonymous"

        img.onload = () => {
            if (img.width === 0 || img.height === 0) {
                setError("Invalid image dimensions")
                setLoading(false)
                return
            }

            imageRef.current = img
            setImageLoaded(true)
            setLoading(false)
        }

        img.onerror = () => {
            setError("Failed to load image")
            setLoading(false)
        }

        // Set the source after setting up event handlers
        img.src = "/photo_5368352788498288391_y.jpg";

    }

    const loadImage = (src: string) => {
        setLoading(true)
        setError(null)
        setImageLoaded(false)

        // Create a new image element
        const img = new Image()
        img.crossOrigin = "anonymous"

        img.onload = () => {
            if (img.width === 0 || img.height === 0) {
                setError("Invalid image dimensions")
                setLoading(false)
                return
            }

            imageRef.current = img
            setImageLoaded(true)
            setLoading(false)
        }

        img.onerror = () => {
            setError("Failed to load image")
            setLoading(false)
        }

        // Set the source after setting up event handlers
        img.src = src
    }

    const handleFileUpload = (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file")
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            if (e.target?.result) {
                loadImage(e.target.result as string)
            }
        }
        reader.onerror = () => {
            setError("Failed to read file")
        }
        reader.readAsDataURL(file)
    }

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0])
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDraggingFile(true)
    }

    const handleDragLeave = () => {
        setIsDraggingFile(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDraggingFile(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0])
        }
    }

    // Helper function to adjust color brightness
    const adjustColorBrightness = (r: number, g: number, b: number, factor: number): string => {
        // Ensure the colors are visible against black background
        const minBrightness = 40 // Minimum brightness to ensure visibility
        r = Math.max(Math.min(Math.round(r * factor), 255), minBrightness)
        g = Math.max(Math.min(Math.round(g * factor), 255), minBrightness)
        b = Math.max(Math.min(Math.round(b * factor), 255), minBrightness)
        return `rgb(${r}, ${g}, ${b})`
    }

    // Add this function after the adjustColorBrightness function
    const renderToCanvas = () => {
        if (!outputCanvasRef.current || !asciiArt || coloredAsciiArt.length === 0) return

        const canvas = outputCanvasRef.current
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Set font properties to match the DOM rendering
        const fontSize = 8 // Base font size in pixels
        ctx.font = `${fontSize}px monospace`
        ctx.textBaseline = "top"

        // Calculate dimensions
        const lineHeight = fontSize
        const charWidth = fontSize * 0.6 // Approximate width of monospace character

        // Resize canvas to fit the ASCII art
        if (grayscale) {
            const lines = asciiArt.split("\n")
            const maxLineLength = Math.max(...lines.map((line) => line.length))
            canvas.width = maxLineLength * charWidth
            canvas.height = lines.length * lineHeight
        } else {
            canvas.width = coloredAsciiArt[0].length * charWidth
            canvas.height = coloredAsciiArt.length * lineHeight
        }

        // Re-apply font after canvas resize
        ctx.font = `${fontSize}px monospace`
        ctx.textBaseline = "top"

        // Render the ASCII art
        if (grayscale) {
            ctx.fillStyle = "white"
            asciiArt.split("\n").forEach((line, lineIndex) => {
                ctx.fillText(line, 0, lineIndex * lineHeight)
            })
        } else {
            coloredAsciiArt.forEach((row, rowIndex) => {
                row.forEach((col, colIndex) => {
                    ctx.fillStyle = col.color
                    ctx.fillText(col.char, colIndex * charWidth, rowIndex * lineHeight)
                })
            })
        }
    }

    // Add this effect to trigger canvas rendering when ASCII art changes
    useEffect(() => {
        if (imageLoaded && !loading && !error) {
            renderToCanvas()
        }
    }, [asciiArt, coloredAsciiArt, grayscale, loading, error, imageLoaded])

    const convertToAscii = () => {
        try {
            if (!canvasRef.current || !imageRef.current) {
                throw new Error("Canvas or image not available")
            }

            const img = imageRef.current

            // Validate image dimensions
            if (img.width === 0 || img.height === 0) {
                throw new Error("Invalid image dimensions")
            }

            const canvas = canvasRef.current
            const ctx = canvas.getContext("2d")
            if (!ctx) {
                throw new Error("Could not get canvas context")
            }

            // Calculate dimensions based on resolution
            const width = Math.floor(img.width * resolution)
            const height = Math.floor(img.height * resolution)

            // Set canvas dimensions to match the image
            canvas.width = img.width
            canvas.height = img.height

            // Clear the canvas first
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw image to canvas
            ctx.drawImage(img, 0, 0, img.width, img.height)

            // Get image data - this is where the error was occurring
            let imageData
            try {
                imageData = ctx.getImageData(0, 0, img.width, img.height)
            } catch (e) {
                throw new Error("Failed to get image data. This might be a CORS issue.")
            }

            const data = imageData.data

            // Choose character set
            const chars = charSets[charSet as keyof typeof charSets]

            // Calculate aspect ratio correction for monospace font
            const fontAspect = 0.5 // Width/height ratio of monospace font characters
            const widthStep = Math.ceil(img.width / width)
            const heightStep = Math.ceil(img.height / height / fontAspect)

            let result = ""
            const coloredResult: ColoredChar[][] = []

            // Process the image
            for (let y = 0; y < img.height; y += heightStep) {
                const coloredRow: ColoredChar[] = []

                for (let x = 0; x < img.width; x += widthStep) {
                    const pos = (y * img.width + x) * 4

                    const r = data[pos]
                    const g = data[pos + 1]
                    const b = data[pos + 2]

                    // Calculate brightness based on grayscale setting
                    let brightness
                    if (grayscale) {
                        // Standard grayscale calculation
                        brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255
                    } else {
                        // Color-aware brightness (perceived luminance)
                        brightness = Math.sqrt(
                            0.299 * (r / 255) * (r / 255) + 0.587 * (g / 255) * (g / 255) + 0.114 * (b / 255) * (b / 255),
                        )
                    }

                    // Invert if needed
                    if (inverted) brightness = 1 - brightness

                    // Map brightness to character
                    const charIndex = Math.floor(brightness * (chars.length - 1))
                    const char = chars[charIndex]

                    result += char

                    // For colored mode, store the character and its color
                    if (!grayscale) {
                        // Adjust color brightness based on the character density
                        // Characters with more "ink" (later in the charset) should be brighter
                        const brightnessFactor = (charIndex / (chars.length - 1)) * 1.5 + 0.5
                        const color = adjustColorBrightness(r, g, b, brightnessFactor)
                        coloredRow.push({ char, color })
                    } else {
                        // For grayscale mode, we still need to populate the array
                        coloredRow.push({ char, color: "white" })
                    }
                }

                result += "\n"
                coloredResult.push(coloredRow)
            }

            setAsciiArt(result)
            setColoredAsciiArt(coloredResult)
            setError(null)
        } catch (err) {
            console.error("Error converting to ASCII:", err)
            setError(err instanceof Error ? err.message : "Unknown error occurred")
            setAsciiArt("")
            setColoredAsciiArt([])
        }
    }

    const downloadAsciiArt = () => {
        if (!asciiArt) {
            setError("No ASCII art to download")
            return
        }

        const element = document.createElement("a")
        const file = new Blob([asciiArt], { type: "text/plain" })
        element.href = URL.createObjectURL(file)
        element.download = "ascii-art.txt"
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    return (
        <div className="relative min-h-screen w-full bg-black text-green-400">
            {/* BACKGROUND + HEADER + BACK */}
            <BackgroundAscii />

            <div
                ref={containerRef}
                className="flex flex-col md:flex-row min-h-screen w-full overflow-hidden select-none"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {/* RIGHT: Preview */}
                <div className="fixed top-[492px] left-4 z-50">
                    <BackArrow />
                </div>

                <div
                    ref={previewRef}
                    className={`order-1 md:order-2 flex-1 bg-black overflow-auto flex items-center justify-center relative`}
                    style={{
                        ...(isHydrated && isDesktop
                            ? {
                                width: `${100 - leftPanelWidth}%`,
                                marginLeft: `${leftPanelWidth}%`,
                            }
                            : {}),
                    }}
                >
                    {isDraggingFile && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                            <div className="ascii-panel p-6 text-center">
                                <div className="text-green-300 text-sm">
                                    <span className="text-green-400">{">"}</span> drop_image_here()
                                </div>
                                <div className="ascii-muted text-xs mt-2">png / jpg / webp</div>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="ascii-panel p-6 text-center">
                            <div className="loading-spinner mx-auto mb-4"></div>
                            <div className="text-green-300">Loading image...</div>
                        </div>
                    ) : error ? (
                        <div className="ascii-panel p-6 text-center border border-red-500/40">
                            <div className="text-red-400">{error}</div>
                            <div className="ascii-muted text-xs mt-2">Try uploading a different image.</div>
                        </div>
                    ) : (
                        <canvas
                            ref={outputCanvasRef}
                            className="max-w-full select-text"
                            style={{
                                fontSize: "0.4rem",
                                lineHeight: "0.4rem",
                                fontFamily: "monospace",
                            }}
                        />
                    )}
                </div>

                {/* Divider (desktop) */}
                {isHydrated && isDesktop && (
                    <div
                        className="order-3 w-2 cursor-col-resize items-center justify-center z-20 ascii-divider"
                        onMouseDown={startDragging}
                        style={{
                            position: "absolute",
                            left: `${leftPanelWidth}%`,
                            top: 0,
                            bottom: 0,
                            display: "flex",
                        }}
                        aria-label="Resize panels"
                        title="Resize"
                    >
                        <GripVertical className="h-6 w-6 text-green-400/40" />
                    </div>
                )}

                {/* LEFT: Control panel */}
                <div
                    className={`order-2 md:order-1 w-full md:h-auto p-3 md:p-4 transition-opacity duration-300 ${!isHydrated ? "opacity-0" : "opacity-100"
                        }`}
                    style={{
                        width: "100%",
                        height: "auto",
                        flex: "0 0 auto",
                        ...(isHydrated && isDesktop
                            ? {
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: `${leftPanelWidth}%`,
                                overflowY: "auto",
                            }
                            : {}),
                    }}
                >
                    <div className="ascii-panel p-4 md:p-6 max-w-[420px]">
                        <h1 className="text-lg font-bold text-green-200">ASCII Art Converter</h1>

                        <div className="ascii-sep my-4" />

                        {/* Resolution */}
                        <div className="space-y-2">
                            <div className="text-sm text-green-300">
                                Resolution: <span className="text-green-200">{resolution.toFixed(2)}</span>
                            </div>

                            <Slider
                                id="resolution"
                                min={0.05}
                                max={0.3}
                                step={0.01}
                                value={[resolution]}
                                onValueChange={(value) => setResolution(value[0])}
                                className="[&>span]:border-none [&_.bg-primary]:bg-green-400/30 [&>.bg-background]:bg-green-400/10"
                            />
                        </div>

                        <div className="ascii-sep my-4" />

                        {/* Charset */}
                        <div className="space-y-2">
                            <div className="text-sm text-green-300">Character Set</div>

                            <Select value={charSet} onValueChange={setCharSet}>
                                <SelectTrigger className="ascii-field">
                                    <SelectValue placeholder="Select character set" />
                                </SelectTrigger>

                                <SelectContent className="bg-black border border-green-400/25 text-green-200">
                                    <SelectItem value="standard" className="focus:bg-green-400/10 focus:text-green-200">
                                        Standard
                                    </SelectItem>
                                    <SelectItem value="detailed" className="focus:bg-green-400/10 focus:text-green-200">
                                        Detailed
                                    </SelectItem>
                                    <SelectItem value="blocks" className="focus:bg-green-400/10 focus:text-green-200">
                                        Block Characters
                                    </SelectItem>
                                    <SelectItem value="minimal" className="focus:bg-green-400/10 focus:text-green-200">
                                        Minimal
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="ascii-sep my-4" />

                        {/* Switches */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Switch
                                    id="invert"
                                    checked={inverted}
                                    onCheckedChange={setInverted}
                                    className="data-[state=checked]:bg-green-400/30"
                                />
                                <Label htmlFor="invert" className="text-green-300">
                                    Invert Colors
                                </Label>
                            </div>

                            <div className="flex items-center gap-3">
                                <Switch
                                    id="grayscale"
                                    checked={grayscale}
                                    onCheckedChange={setGrayscale}
                                    className="data-[state=checked]:bg-green-400/30"
                                />
                                <Label htmlFor="grayscale" className="text-green-300">
                                    Grayscale Mode
                                </Label>
                            </div>
                        </div>

                        <div className="ascii-sep my-4" />

                        {/* Hidden: original (untouched) */}
                        <div className="hidden">
                            <canvas ref={canvasRef} width="300" height="300"></canvas>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleFileInputChange}
                                className="hidden"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button
                                onClick={() => {
                                    if (!asciiArt) {
                                        setError("No ASCII art to copy")
                                        return
                                    }
                                    const el = document.createElement("textarea")
                                    el.value = asciiArt
                                    document.body.appendChild(el)
                                    el.select()
                                    document.execCommand("copy")
                                    document.body.removeChild(el)
                                    alert("ASCII art copied to clipboard!")
                                }}
                                className="flex-1 btn-terminal"
                                disabled={loading || !imageLoaded}
                            >
                                Copy
                            </Button>

                            <Button
                                onClick={downloadAsciiArt}
                                className="btn-terminal"
                                title="Download ASCII Art"
                                disabled={loading || !imageLoaded || !asciiArt}
                            >
                                <Download className="h-4 w-4" />
                            </Button>

                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                className="btn-terminal"
                                title="Upload Image"
                            >
                                <Upload className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="ascii-muted text-xs mt-3">
                            Tip: drag & drop an image прямо в preview
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}