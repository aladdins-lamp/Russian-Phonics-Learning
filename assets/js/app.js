// 全局变量，存储从 JSON 加载的数据
let russianData = null;

// 1. 初始化：加载数据并渲染
document.addEventListener('DOMContentLoaded', () => {
    console.log("正在尝试加载数据...");
    fetch('./data.json') // 使用相对路径确保 GitHub Pages 兼容
        .then(response => {
            if (!response.ok) throw new Error("无法获取 data.json，请检查文件是否存在");
            return response.json();
        })
        .then(data => {
            russianData = data;
            console.log("数据加载成功:", data);
            renderAlphabet(data.alphabet);
        })
        .catch(err => {
            console.error("加载失败:", err);
            document.getElementById('alphabet-container').innerHTML = `<p style="color:red">加载失败: ${err.message}</p>`;
        });
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

// 3. 点击交互：显示详情弹窗
function showDetail(id) {
    const item = russianData.alphabet.find(a => a.id === id);
    const detailView = document.getElementById('letter-detail-view');
    
    // 生成拼读行
    let phoneticsHtml = item.phonetics.map(p => `
        <div class="phonetic-section">
            <p><strong>${p.description}</strong> <span class="ipa">${p.ipa}</span> 
               <button class="play-btn" onclick="AudioModule.playSound(AudioModule.getAudioUrl(russianData, '${p.sound_audio}'))">🔊 播放发音</button>
            </p>
            <div class="example-list">
                ${p.examples.map(ex => `
                    <div class="example-item">
                        <span>${ex.text} <small class="ipa">${ex.ipa}</small> - ${ex.translation}</span>
                        <button class="play-btn-sm" onclick="AudioModule.playSound(AudioModule.getAudioUrl(russianData, '${ex.audio}'))">小喇叭</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('<hr>');

    detailView.innerHTML = `<h2>字母 ${item.char_upper} ${item.char_lower}</h2>` + phoneticsHtml;
    document.getElementById('detail-modal').style.display = 'flex';
}

// 4. 音频播放模块
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
