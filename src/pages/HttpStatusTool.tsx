import { useState } from 'react';
import { Search, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const httpStatuses = [
    // 1xx Informational
    { code: 100, name: 'Continue', desc: '继续。客户端应继续其请求' },
    { code: 101, name: 'Switching Protocols', desc: '切换协议' },

    // 2xx Success
    { code: 200, name: 'OK', desc: '请求成功' },
    { code: 201, name: 'Created', desc: '已创建。成功请求并创建了新的资源' },
    { code: 202, name: 'Accepted', desc: '已接受。已经接受请求，但未处理完成' },
    { code: 204, name: 'No Content', desc: '无内容。服务器成功处理，但未返回内容' },

    // 3xx Redirection
    { code: 301, name: 'Moved Permanently', desc: '永久移动。请求的资源已被永久移动到新URI' },
    { code: 302, name: 'Found', desc: '临时移动' },
    { code: 304, name: 'Not Modified', desc: '未修改。所请求的资源未修改' },

    // 4xx Client Error
    { code: 400, name: 'Bad Request', desc: '客户端请求的语法错误，服务器无法理解' },
    { code: 401, name: 'Unauthorized', desc: '请求要求用户的身份认证' },
    { code: 403, name: 'Forbidden', desc: '服务器理解请求，但拒绝执行' },
    { code: 404, name: 'Not Found', desc: '服务器无法根据客户端的请求找到资源' },
    { code: 405, name: 'Method Not Allowed', desc: '客户端请求中的方法被禁止' },
    { code: 408, name: 'Request Timeout', desc: '服务器等待客户端发送的请求时间过长，超时' },
    { code: 429, name: 'Too Many Requests', desc: '用户在给定的时间内发送了太多的请求' },

    // 5xx Server Error
    { code: 500, name: 'Internal Server Error', desc: '服务器内部错误，无法完成请求' },
    { code: 501, name: 'Not Implemented', desc: '服务器不支持请求的功能，无法完成请求' },
    { code: 502, name: 'Bad Gateway', desc: '作为网关或代理工作的服务器从上游服务器收到无效响应' },
    { code: 503, name: 'Service Unavailable', desc: '由于超载或系统维护，服务器暂时无法处理请求' },
    { code: 504, name: 'Gateway Timeout', desc: '充当网关或代理的服务器，未及时从上游服务器获取请求' },
];

export function HttpStatusTool() {
    const [search, setSearch] = useState('');

    const filtered = httpStatuses.filter(
        (status) =>
            status.code.toString().includes(search) ||
            status.name.toLowerCase().includes(search.toLowerCase()) ||
            status.desc.includes(search)
    );

    const getStatusColor = (code: number) => {
        if (code < 200) return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20';
        if (code < 300) return 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20';
        if (code < 400) return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/20';
        if (code < 500) return 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20';
        return 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">HTTP 状态码</h2>
                    <p className="text-muted-foreground">HTTP 响应状态码参考手册。</p>
                </div>
            </div>

            <Card className="shadow-md">
                <CardHeader className="bg-muted/30 border-b pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        搜索状态码
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="输入状态码或描述进行搜索..."
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background text-lg"
                    />
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((status) => (
                    <Card key={status.code} className="shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                                <div
                                    className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 flex items-center justify-center font-bold text-lg ${getStatusColor(
                                        status.code
                                    )}`}
                                >
                                    {status.code}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg mb-1">{status.name}</h3>
                                    <p className="text-sm text-muted-foreground">{status.desc}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <Info className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>未找到匹配的状态码</p>
                </div>
            )}
        </div>
    );
}
