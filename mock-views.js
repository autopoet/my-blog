import fs from 'fs';
import path from 'path';

// 【配置区】请填入你从 Upstash 控制台拿到的 URL 和 Token
const UPSTASH_REDIS_REST_URL = 'https://dynamic-lion-76001.upstash.io';
const UPSTASH_REDIS_REST_TOKEN = 'gQAAAAAAASjhAAIncDExZDVjOTg3YWI2ZTc0NDYwYTI5MmZkZTJmZGRjMjU5ZHAxNzYwMDE';

const postsDir = path.resolve('pages/posts');

async function mockViews() {
  if (UPSTASH_REDIS_REST_URL === 'YOUR_URL' || UPSTASH_REDIS_REST_TOKEN === 'YOUR_TOKEN') {
    console.error('报错：请先在代码第 5、6 行填入你的 Upstash URL 和 Token！');
    return;
  }

  // 1. 获取所有文章的文件名作为 slug
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  const slugs = files.map(f => f.replace('.md', ''));

  console.log(`开始为 ${slugs.length} 篇文章生成随机浏览量...`);

  for (const slug of slugs) {
    // 生成 6 到 15 之间的随机整数
    const count = Math.floor(Math.random() * (15 - 6 + 1)) + 6;

    try {
      // 使用 Redis 的 SET 命令直接强制覆盖数值
      const response = await fetch(`${UPSTASH_REDIS_REST_URL}/set/pageviews:${slug}/${count}`, {
        headers: {
          Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`
        }
      });

      if (response.ok) {
        console.log(`已完成: [${slug}] -> ${count} 次浏览`);
      } else {
        console.error(`败: [${slug}]`);
      }
    } catch (err) {
      console.error(`网络错误: [${slug}]`, err.message);
    }
  }

  console.log('\n全部初始化完成！重新打开博客页面看看吧。');
}

mockViews();
