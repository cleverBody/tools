import { useState } from 'react';
import { Clock, Copy } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useToast } from '../contexts/ToastContext';
import cronstrue from 'cronstrue/i18n';

export function CronTool() {
    const [expression, setExpression] = useState('0 0 * * *');
    const [minute, setMinute] = useState('0');
    const [hour, setHour] = useState('0');
    const [dayOfMonth, setDayOfMonth] = useState('*');
    const [month, setMonth] = useState('*');
    const [dayOfWeek, setDayOfWeek] = useState('*');
    const { showToast } = useToast();

    const buildExpression = () => {
        return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    };

    const getDescription = (expr: string) => {
        try {
            return cronstrue.toString(expr, { locale: 'zh_CN', use24HourTimeFormat: true });
        } catch (e) {
            return '无效的 Cron 表达式';
        }
    };

    const handleBuild = () => {
        const expr = buildExpression();
        setExpression(expr);
    };

    const copyExpression = () => {
        navigator.clipboard.writeText(expression);
        showToast('已复制 Cron 表达式');
    };

    const presets = [
        { name: '每分钟', expr: '* * * * *' },
        { name: '每小时', expr: '0 * * * *' },
        { name: '每天午夜', expr: '0 0 * * *' },
        { name: '每天中午', expr: '0 12 * * *' },
        { name: '每周一', expr: '0 0 * * 1' },
        { name: '每月1号', expr: '0 0 1 * *' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Cron 表达式生成器</h2>
                    <p className="text-muted-foreground">可视化构建和解析 Cron 定时任务表达式。</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            可视化构建
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">分钟 (0-59)</label>
                                <input
                                    type="text"
                                    value={minute}
                                    onChange={(e) => setMinute(e.target.value)}
                                    placeholder="0 或 * 或 */5"
                                    className="w-full px-3 py-2 rounded border border-input bg-background font-mono mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">小时 (0-23)</label>
                                <input
                                    type="text"
                                    value={hour}
                                    onChange={(e) => setHour(e.target.value)}
                                    placeholder="0 或 * 或 */2"
                                    className="w-full px-3 py-2 rounded border border-input bg-background font-mono mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">日期 (1-31)</label>
                                <input
                                    type="text"
                                    value={dayOfMonth}
                                    onChange={(e) => setDayOfMonth(e.target.value)}
                                    placeholder="* 或 1 或 1,15"
                                    className="w-full px-3 py-2 rounded border border-input bg-background font-mono mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">月份 (1-12)</label>
                                <input
                                    type="text"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    placeholder="* 或 1 或 1-6"
                                    className="w-full px-3 py-2 rounded border border-input bg-background font-mono mt-1"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium">星期 (0-6, 0=周日)</label>
                                <input
                                    type="text"
                                    value={dayOfWeek}
                                    onChange={(e) => setDayOfWeek(e.target.value)}
                                    placeholder="* 或 1 或 1-5"
                                    className="w-full px-3 py-2 rounded border border-input bg-background font-mono mt-1"
                                />
                            </div>
                        </div>

                        <Button onClick={handleBuild} className="w-full">
                            生成表达式
                        </Button>

                        <div className="pt-4 border-t">
                            <p className="text-sm font-medium mb-2">常用预设:</p>
                            <div className="grid grid-cols-2 gap-2">
                                {presets.map((preset) => (
                                    <button
                                        key={preset.name}
                                        onClick={() => setExpression(preset.expr)}
                                        className="px-3 py-2 text-sm rounded bg-muted hover:bg-muted/80 transition-colors text-left"
                                    >
                                        {preset.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">表达式解析</CardTitle>
                        <Button variant="ghost" size="sm" onClick={copyExpression} className="h-8">
                            <Copy className="w-4 h-4 mr-2" />
                            复制
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div>
                            <label className="text-sm font-medium">Cron 表达式</label>
                            <input
                                type="text"
                                value={expression}
                                onChange={(e) => setExpression(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-input bg-background font-mono text-lg mt-1"
                                placeholder="0 0 * * *"
                            />
                        </div>

                        <div className="p-4 bg-primary/5 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">执行时间:</p>
                            <p className="text-lg font-medium">{getDescription(expression)}</p>
                        </div>

                        <div className="p-4 bg-muted/30 rounded-lg space-y-2 text-sm">
                            <p className="font-medium">格式说明:</p>
                            <div className="font-mono text-xs space-y-1">
                                <p>分钟 小时 日期 月份 星期</p>
                                <p className="text-muted-foreground">
                                    * = 任意值 | */n = 每n个单位 | a-b = 范围 | a,b = 列表
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
