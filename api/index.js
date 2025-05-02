import axios from 'axios';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing "url" query parameter.' });
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Android 14; Mobile; rv:140.0) Gecko/140.0 Firefox/140.0',
        'Cookie': 'csrfToken=w-amxGXeSwvJlnY0KAmtkcJi; browserid=g4pwekwITBbiMDo2Ypo3cwa4MhmikiorkPY7AwGyF6LNsF1tgbIuadeAjjY=; lang=en; __bid_n=1968fbfd6d6ac79fe14207; __stripe_mid=807cef33-c102-4df2-b012-9fa1889f5414c6ff34; __stripe_sid=422f3dfc-fc99-4afe-a965-9f4319a4b70cae6243; ndus=YvuYYdkpeHuiaR93oc-t1eAylmsUi2NSs28kxuLS; _ga_06ZNKL8C2E=GS1.1.1746168476.1.0.1746168476.60.0.0; _ga=GA1.1.1369568936.1746168477; ndut_fmt=75724EA129638332F7DD4E4A77031C9E546985C64EA3CFFD5A0DF30E40F3ABF0'
      }
    });

    const html = response.data;
    const match = html.match(/https:\/\/download[^"']+/);

    if (match) {
      return res.status(200).json({ success: true, direct_link: match[0] });
    } else {
      return res.status(404).json({ error: 'Direct link not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching link', details: error.message });
  }
}
