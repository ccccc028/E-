// ==UserScript==
// @name         E交点助手
// @namespace
// @version      1.3
// @description  每隔2-3分钟模拟一次鼠标移动，避免在线课堂挂机检测，检测到视频结束过后，自动点击下一个
// @author       小张和ChatGPT⬅️这是大佬，我只是给他提需求和打辅助
// @icon         https://picobd.yxt.com/orgs/yxt_malladmin/mvcpic/image/201811/71672740d9524c53ac3d60b6a4123bca.png
// @match        http*://*.yunxuetang.cn/plan/*.html
// @match        http*://*.yunxuetang.cn/kng/*/document/*
// @match        http*://*.yunxuetang.cn/kng/*/video/*
// @match        http*://*.yunxuetang.cn/kng/plan/package/*
// @match        http*://*.yunxuetang.cn/kng/view/package/*
// @match        http*://*.yunxuetang.cn/kng/course/package/video/*
// @match        http*://*.yunxuetang.cn/kng/course/package/document/*
// @match        http*://*.yunxuetang.cn/sty/index.htm
// @match        http*://*.yunxuetang.cn/exam/test/examquestionpreview.htm*
// @match        https://zjjt.yunxuetang.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    console.log("脚本加载完毕");

    // 每隔3分钟模拟一次鼠标移动
    setInterval(() => {
        let x = Math.floor(Math.random() * window.innerWidth);
        let y = Math.floor(Math.random() * window.innerHeight);

        // 使用 MouseEvent 创建事件
        let event = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        });

        // 手动触发事件
        document.dispatchEvent(event);
        console.log(`已模拟鼠标移动，坐标：(${x}, ${y})`);
    }, 100000); // 3分钟 = 180,000 毫秒

    /***************** 视频结束自动点击下一个 *****************/
    function clickNextButton() {
        let nextButton = document.querySelector('button.yxtf-button.ml12.yxtf-button--default.is-plain.is-icon');
        if (nextButton) {
            console.log('找到“下一个”按钮，正在点击...');
            nextButton.click();
        } else {
            console.log('未找到“下一个”按钮');
        }
    }

    // 保存当前监控的 video 元素，确保只为新 video 绑定事件
    let currentVideo = null;

    // 当视频播放结束时调用
    function onVideoEnded() {
        console.log('HTML5 视频播放完毕，准备点击“下一个”按钮');
        setTimeout(() => {
            clickNextButton();
        }, 2000);
        // 移除当前 video 的事件绑定，并重置 currentVideo 以便下次绑定
        if (currentVideo) {
            currentVideo.removeEventListener('ended', onVideoEnded);
        }
        currentVideo = null;
    }

    // 检查当前页面中的 video 元素，并为新的 video 绑定 ended 事件
    function monitorHTML5Video() {
        let video = document.querySelector('video');
        if (!video) {
            console.log('未找到 HTML5 视频');
            return;
        }
        // 如果找到的 video 与之前的不一致，则为新 video 绑定事件
        if (video !== currentVideo) {
            // 如果之前已有 video，先移除它的事件绑定（保险起见）
            if (currentVideo) {
                currentVideo.removeEventListener('ended', onVideoEnded);
            }
            currentVideo = video;
            console.log('检测到新的 HTML5 视频，绑定监听事件...');
            currentVideo.addEventListener('ended', onVideoEnded);
        }
    }

    // 每 2 秒检查一次 video（可根据需要调整检查间隔）
    setInterval(monitorHTML5Video, 2000);

})();

