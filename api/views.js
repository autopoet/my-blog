export default async function handler(req, res) {
  // 1. 获取前端传过来的文章唯一标识 (比如文章文件名)
  const { slug } = req.query;

  if (!slug) {
    // HTTP 八股：400 Bad Request 代表客户端请求参数错误
    return res.status(400).json({ error: '缺少参数 slug' });
  }

  // 2. 从环境变量读取 Upstash Redis 的配置
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 如果用户本地没配置环境变量，不要让程序崩溃，直接返回 0
  if (!url || !token) {
    return res.status(200).json({ views: 0 });
  }

  try {
    // 3. 核心逻辑：使用 Redis 的原子操作 INCR
    // 为什么用 Redis INCR？（面试考点：哪怕 100 个人同时访问，Redis 的单线程原子性也能保证数据精确 +1，不会出现并发冲突）
    const response = await fetch(`${url}/incr/pageviews:${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    // HTTP 八股：200 OK 代表请求成功
    return res.status(200).json({ views: data.result });
  } catch (error) {
    console.error('Redis 请求报错:', error);
    // HTTP 八股：500 Internal Server Error 代表服务端内部错误
    return res.status(500).json({ error: '服务器内部错误' });
  }
}
