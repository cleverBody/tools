import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileJson, Fingerprint, Clock, Link as LinkIcon, FileCode, Hash, KeyRound, Regex, Palette, QrCode, KeySquare, FileText, FileEdit, BarChart3, ListFilter, FileSpreadsheet, Binary, Ruler, Clock3, Code2, Type, Info, Languages, Image, ScanLine, ChevronDown, ChevronRight, GitCompare } from 'lucide-react';
import { cn } from '../lib/utils';

const navCategories = [
    {
        name: '常用工具',
        id: 'common',
        icon: '🔧',
        items: [
            { icon: FileJson, label: 'JSON 工具', path: '/json' },
            { icon: GitCompare, label: 'JSON 对比', path: '/json-diff' },
            { icon: Fingerprint, label: 'UUID 生成', path: '/uuid' },
            { icon: Clock, label: '时间转换', path: '/time' },
            { icon: LinkIcon, label: 'URL 编解码', path: '/url' },
            { icon: FileCode, label: 'Base64 转换', path: '/base64' },
            { icon: Hash, label: '哈希生成', path: '/hash' },
            { icon: KeyRound, label: '密码生成', path: '/password' },
            { icon: Regex, label: '正则测试', path: '/regex' },
        ],
    },
    {
        name: '文本处理',
        id: 'text',
        icon: '📝',
        items: [
            { icon: FileText, label: '文本对比', path: '/diff' },
            { icon: FileEdit, label: 'Markdown 编辑', path: '/markdown' },
            { icon: BarChart3, label: '文本统计', path: '/text-stats' },
            { icon: ListFilter, label: '文本去重', path: '/deduplicate' },
        ],
    },
    {
        name: '数据转换',
        id: 'conversion',
        icon: '🔄',
        items: [
            { icon: FileSpreadsheet, label: 'CSV/JSON', path: '/csv-json' },
            { icon: Binary, label: '进制转换', path: '/base-converter' },
            { icon: Ruler, label: '单位换算', path: '/unit-converter' },
        ],
    },
    {
        name: '开发工具',
        id: 'developer',
        icon: '⚙️',
        items: [
            { icon: Clock3, label: 'Cron 表达式', path: '/cron' },
            { icon: Code2, label: 'HTML 实体', path: '/html-entity' },
            { icon: Type, label: '命名风格', path: '/case-converter' },
            { icon: Info, label: 'HTTP 状态码', path: '/http-status' },
            { icon: Languages, label: 'Unicode', path: '/unicode' },
            { icon: KeySquare, label: 'JWT 解码', path: '/jwt' },
        ],
    },
    {
        name: '图片工具',
        id: 'image',
        icon: '🖼️',
        items: [
            { icon: Palette, label: '颜色转换', path: '/color' },
            { icon: QrCode, label: '二维码生成', path: '/qr' },
            { icon: Image, label: '图片转 Base64', path: '/image-base64' },
            { icon: ScanLine, label: '二维码识别', path: '/qr-scanner' },
        ],
    },
];

export function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('common');
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const mainRef = useRef<HTMLElement>(null);
    const isHomePage = location.pathname === '/';

    // 获取当前工具所属的分类
    const currentCategory = navCategories.find(cat =>
        cat.items.some(item => item.path === location.pathname)
    );

    // 在工具页面时，只显示当前分类；在首页显示所有分类
    const displayCategories = isHomePage ? navCategories : (currentCategory ? [currentCategory] : navCategories);

    // 滚动监听 - 高亮当前分类
    useEffect(() => {
        if (!isHomePage) {
            setActiveSection('');
            return;
        }

        const mainElement = mainRef.current;
        if (!mainElement) return;

        const handleScroll = () => {
            const sections = navCategories.map(cat => cat.id);
            const scrollPosition = mainElement.scrollTop + 300; // 偏移量

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i]);
                if (section) {
                    const sectionTop = section.offsetTop;
                    if (sectionTop <= scrollPosition) {
                        setActiveSection(sections[i]);
                        return;
                    }
                }
            }
            // 如果滚动到顶部，默认高亮第一个
            if (scrollPosition < 500) {
                setActiveSection('common');
            }
        };

        mainElement.addEventListener('scroll', handleScroll);
        handleScroll(); // 初始化

        return () => mainElement.removeEventListener('scroll', handleScroll);
    }, [isHomePage]);

    // 根据当前路由自动展开对应分类
    useEffect(() => {
        if (currentCategory) {
            setExpandedCategories(new Set([currentCategory.id]));
        }
    }, [currentCategory]);

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        const mainElement = mainRef.current;
        if (section && mainElement) {
            const offset = 100;
            const top = section.offsetTop - offset;
            mainElement.scrollTo({ top, behavior: 'smooth' });
        }
    };

    return (
        <div className="flex h-screen bg-background text-foreground font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-card/50 backdrop-blur-xl flex flex-col">
                <div className="p-6 border-b">
                    <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Fingerprint className="w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">DevTools</h1>
                    </Link>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    {displayCategories.map((category) => {
                        const isExpanded = expandedCategories.has(category.id);
                        const isActive = activeSection === category.id;
                        const hasActiveTool = category.items.some(item => item.path === location.pathname);

                        return (
                            <div key={category.name} className="space-y-1">
                                {/* Category Header */}
                                <button
                                    onClick={() => {
                                        if (isHomePage) {
                                            scrollToSection(category.id);
                                        } else {
                                            toggleCategory(category.id);
                                        }
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                                        isActive && isHomePage
                                            ? "bg-primary/10 text-primary"
                                            : hasActiveTool
                                                ? "bg-muted text-foreground"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{category.icon}</span>
                                        <span>{category.name}</span>
                                    </div>
                                    {!isHomePage && (
                                        <div className="p-0.5">
                                            {isExpanded ? (
                                                <ChevronDown className="w-4 h-4" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4" />
                                            )}
                                        </div>
                                    )}
                                </button>

                                {/* Category Items - 只在非首页且展开时显示 */}
                                {!isHomePage && isExpanded && (
                                    <div className="ml-2 pl-3 border-l-2 border-muted space-y-0.5">
                                        {category.items.map((item) => {
                                            const Icon = item.icon;
                                            const isItemActive = location.pathname === item.path;
                                            return (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    className={cn(
                                                        "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 group text-sm",
                                                        isItemActive
                                                            ? "bg-primary text-primary-foreground shadow-sm"
                                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                                    )}
                                                >
                                                    <Icon className={cn("w-3.5 h-3.5 transition-transform group-hover:scale-110", isItemActive && "animate-pulse")} />
                                                    <span className="font-medium">{item.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
                <div className="p-4 border-t text-xs text-center text-muted-foreground">
                    © 2025 DevTools · 25 工具
                </div>
            </aside>

            {/* Main Content */}
            <main ref={mainRef} className="flex-1 overflow-auto">
                <div className="p-8 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
