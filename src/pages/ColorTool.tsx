import { useState } from 'react';
import { Palette, Copy } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useToast } from '../contexts/ToastContext';

export function ColorTool() {
    const [hex, setHex] = useState('#6366f1');
    const [rgb, setRgb] = useState({ r: 99, g: 102, b: 241 });
    const [hsl, setHsl] = useState({ h: 239, s: 84, l: 67 });
    const { showToast } = useToast();

    // Convert HEX to RGB
    const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            }
            : null;
    };

    // Convert RGB to HEX
    const rgbToHex = (r: number, g: number, b: number): string => {
        return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
    };

    // Convert RGB to HSL
    const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                    break;
                case g:
                    h = ((b - r) / d + 2) / 6;
                    break;
                case b:
                    h = ((r - g) / d + 4) / 6;
                    break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100),
        };
    };

    // Convert HSL to RGB
    const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
        };
    };

    const updateFromHex = (newHex: string) => {
        setHex(newHex);
        const rgbVal = hexToRgb(newHex);
        if (rgbVal) {
            setRgb(rgbVal);
            setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
        }
    };

    const updateFromRgb = (r: number, g: number, b: number) => {
        setRgb({ r, g, b });
        setHex(rgbToHex(r, g, b));
        setHsl(rgbToHsl(r, g, b));
    };

    const updateFromHsl = (h: number, s: number, l: number) => {
        setHsl({ h, s, l });
        const rgbVal = hslToRgb(h, s, l);
        setRgb(rgbVal);
        setHex(rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b));
    };

    const copyColor = (value: string, format: string) => {
        navigator.clipboard.writeText(value);
        showToast(`已复制 ${format} 值`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">颜色转换器</h2>
                    <p className="text-muted-foreground">在 HEX、RGB、HSL 格式之间转换颜色。</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Color Preview */}
                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Palette className="w-5 h-5" />
                            颜色预览
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div
                            className="w-full h-48 rounded-xl border-4 border-border shadow-lg transition-all duration-300"
                            style={{ backgroundColor: hex }}
                        />
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={hex}
                                onChange={(e) => updateFromHex(e.target.value)}
                                className="w-16 h-16 rounded-lg cursor-pointer border-2 border-border"
                            />
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-1">点击选择颜色</p>
                                <p className="font-mono text-lg font-bold">{hex.toUpperCase()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Color Values */}
                <div className="space-y-4">
                    {/* HEX */}
                    <Card className="shadow-sm">
                        <CardHeader className="py-3 bg-muted/10 border-b flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">HEX</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyColor(hex.toUpperCase(), 'HEX')}
                                className="h-6 px-2"
                            >
                                <Copy className="w-3 h-3 mr-1" />
                                复制
                            </Button>
                        </CardHeader>
                        <CardContent className="py-3">
                            <input
                                type="text"
                                value={hex}
                                onChange={(e) => updateFromHex(e.target.value)}
                                className="w-full px-3 py-2 rounded-md border border-input bg-background font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="#000000"
                            />
                        </CardContent>
                    </Card>

                    {/* RGB */}
                    <Card className="shadow-sm">
                        <CardHeader className="py-3 bg-muted/10 border-b flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">RGB</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyColor(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB')}
                                className="h-6 px-2"
                            >
                                <Copy className="w-3 h-3 mr-1" />
                                复制
                            </Button>
                        </CardHeader>
                        <CardContent className="py-3 space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="text-xs text-muted-foreground">R</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="255"
                                        value={rgb.r}
                                        onChange={(e) => updateFromRgb(parseInt(e.target.value) || 0, rgb.g, rgb.b)}
                                        className="w-full px-2 py-1 rounded border border-input bg-background font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground">G</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="255"
                                        value={rgb.g}
                                        onChange={(e) => updateFromRgb(rgb.r, parseInt(e.target.value) || 0, rgb.b)}
                                        className="w-full px-2 py-1 rounded border border-input bg-background font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground">B</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="255"
                                        value={rgb.b}
                                        onChange={(e) => updateFromRgb(rgb.r, rgb.g, parseInt(e.target.value) || 0)}
                                        className="w-full px-2 py-1 rounded border border-input bg-background font-mono text-sm"
                                    />
                                </div>
                            </div>
                            <p className="font-mono text-sm text-muted-foreground">
                                rgb({rgb.r}, {rgb.g}, {rgb.b})
                            </p>
                        </CardContent>
                    </Card>

                    {/* HSL */}
                    <Card className="shadow-sm">
                        <CardHeader className="py-3 bg-muted/10 border-b flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">HSL</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyColor(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL')}
                                className="h-6 px-2"
                            >
                                <Copy className="w-3 h-3 mr-1" />
                                复制
                            </Button>
                        </CardHeader>
                        <CardContent className="py-3 space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="text-xs text-muted-foreground">H</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="360"
                                        value={hsl.h}
                                        onChange={(e) => updateFromHsl(parseInt(e.target.value) || 0, hsl.s, hsl.l)}
                                        className="w-full px-2 py-1 rounded border border-input bg-background font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground">S</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={hsl.s}
                                        onChange={(e) => updateFromHsl(hsl.h, parseInt(e.target.value) || 0, hsl.l)}
                                        className="w-full px-2 py-1 rounded border border-input bg-background font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground">L</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={hsl.l}
                                        onChange={(e) => updateFromHsl(hsl.h, hsl.s, parseInt(e.target.value) || 0)}
                                        className="w-full px-2 py-1 rounded border border-input bg-background font-mono text-sm"
                                    />
                                </div>
                            </div>
                            <p className="font-mono text-sm text-muted-foreground">
                                hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
