export default async function handler(req, res) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return res.status(200).json({ comments: [] });
  }

  // --- 处理 GET 请求：获取文章的所有评论 ---
  if (req.method === 'GET') {
    const { slug } = req.query;
    if (!slug) return res.status(400).json({ error: '缺少 slug' });

    try {
      // 通过 Upstash 的原生命令格式发送 (获取列表 0 到 -1 即所有元素)
      const response = await fetch(`${url}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(["LRANGE", `comments:${slug}`, "0", "-1"])
      });
      const data = await response.json();
      
      // Redis 存的是字符串，我们需要反序列化为 JSON 对象返回给前端
      const comments = data.result ? data.result.map(c => JSON.parse(c)) : [];
      return res.status(200).json({ comments });
    } catch (error) {
      console.error('获取评论失败:', error);
      return res.status(500).json({ error: '获取失败' });
    }
  }

  // --- 处理 POST 请求：提交新评论 ---
  if (req.method === 'POST') {
    try {
        const { slug, author, content, date } = req.body;
        
        if (!slug || !content) {
            return res.status(400).json({ error: '缺少必要参数' });
        }

        // 基本的 XSS 防御：存储前对危险符号转义（双重保险，前端Vue渲染本身也有防御）
        const safeContent = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const safeAuthor = (author || '匿名访客').replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const newComment = {
            author: safeAuthor,
            content: safeContent,
            date: date || new Date().toISOString()
        };

        // LPUSH 将最新留言插入到列表的头部 (索引0的位置)
        const response = await fetch(`${url}`, {
            method: 'POST',
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(["LPUSH", `comments:${slug}`, JSON.stringify(newComment)])
        });

        if (response.ok) {
            return res.status(200).json({ success: true, comment: newComment });
        } else {
            return res.status(500).json({ error: '保存失败' });
        }

    } catch (error) {
        console.error('提交评论失败:', error);
        return res.status(500).json({ error: '提交失败' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
