// ملف: keep-alive.js

const puppeteer = require('puppeteer');

const USERNAME = process.env.ATERNOS_USER;
const PASSWORD = process.env.ATERNOS_PASS;
const SERVER_URL = 'https://aternos.org/server/';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://aternos.org/accounts/login/', { waitUntil: 'networkidle2' });

    // تعبئة اسم المستخدم وكلمة المرور
    await page.type('input[name="user"]', USERNAME);
    await page.type('input[name="password"]', PASSWORD);
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // الذهاب إلى صفحة السيرفر
    await page.goto(SERVER_URL, { waitUntil: 'networkidle2' });

    // انتظار زر التشغيل والضغط عليه إذا كان موجودًا
    const startButtonSelector = '.server-start';
    const isStartVisible = await page.$(startButtonSelector);
    if (isStartVisible) {
      await page.click(startButtonSelector);
      console.log('✅ تم الضغط على زر التشغيل.');
    } else {
      console.log('ℹ️ السيرفر يعمل أو لا يوجد زر تشغيل.');
    }

    // إبقاء الصفحة نشطة لبعض الوقت
    await page.waitForTimeout(30000); // 30 ثانية

  } catch (err) {
    console.error('❌ حدث خطأ:', err);
  } finally {
    await browser.close();
  }
})();
