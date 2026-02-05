// 全局变量，存储从 JSON 加载的数据
let russianData = null;

// 1. 初始化：页面加载时自动读取 JSON
document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            russianData = data;
            renderAlphabet(data.alphabet);
        })
        .catch(err => console.error("加载数据失败:", err));
});

// 2. 渲染首页字母列表
function renderAlphabet(alphabet) {
    const container = document.getElementById('alphabet-container');
    container.innerHTML = alphabet.map(item => `
        <div class="letter-card" onclick="showDetail('${item.id}')">
            <div class="char">${item.char_upper} ${item.char_lower}</div>
            <div class="ipa">${item.name_ipa}</div>
        </div>
    `).join('');
}

// 3. 点击字母显示详情逻辑
function showDetail(id) {
    const item = russianData.alphabet.find(a => a.id === id);
    const detailView = document.getElementById('letter-detail-view');
    
    // 生成详情页 HTML，包含之前讨论的播放函数
    let phoneticsHtml = item.phonetics.map(p => `
        <div class="phonetic-row">
            <span>${p.description} <b>${p.ipa}</b></span>
            <button onclick="AudioModule.playSound(AudioModule.getAudioUrl(russianData, '${p.sound_audio}'))">🔊 发音</button>
        </div>
        <div class="example-box">
            ${p.examples.map(ex => `
                <p>${ex.text} ${ex.ipa} (${ex.translation}) 
                   <button onclick="AudioModule.playSound(AudioModule.getAudioUrl(russianData, '${ex.audio}'))">小喇叭</button>
                </p>
            `).join('')}
        </div>
    `).join('<hr>');

    detailView.innerHTML = `<h2>${item.char_upper} ${item.char_lower}</h2>` + phoneticsHtml;
    document.getElementById('detail-modal').style.display = 'block';
}

// 之前定义的音频模块（保持不变）
const AudioModule = {
    getAudioUrl: (data, fileName) => fileName ? `${data.app_info.audio_base_path}${fileName}` : null,
    playSound: (url) => {
        if (!url) return;
        if (!window.currentAudio) window.currentAudio = new Audio();
        window.currentAudio.pause();
        window.currentAudio.src = url;
        window.currentAudio.play().catch(e => console.log("音频播放受阻，需用户点击触发"));
    }
};

function closeDetail() {
    document.getElementById('detail-modal').style.display = 'none';
}
