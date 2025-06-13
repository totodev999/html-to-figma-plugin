// import * as monaco from 'monaco-editor'; // ← monaco-editorのimportを削除
import { htmlToFigma, setContext } from '../../src/browser';
import throttle from 'lodash.throttle';
import { LayerNode } from '../../src/types';

document.addEventListener('DOMContentLoaded', function () {
    console.log("document.addEventListener('DOMContentLoaded', function () {");
    const editorTextarea = document.getElementById(
        'html-input'
    ) as HTMLTextAreaElement;
    if (!editorTextarea) return;

    editorTextarea.value = `
<html>
    <style>
        .button {
            padding: 10px;
        }
    </style>
    <body>
        <div id="container">
            <button class="button">TEST</button>
        </div>
    </body>
</html>
`.trim();

    const sendButton = document.getElementById('send') as HTMLButtonElement;
    // Figmaへの変換処理を関数として定義
    const convertToFigma = async () => {
        // ★UI用コンソールで確認★
        console.log('[UI] 1. convertToFigmaが開始されました。');
        const parser = new DOMParser();
        const doc = parser.parseFromString(editorTextarea.value, 'text/html');

        console.log('doc', doc);
        console.log('[UI] 2. iFrameのウィンドウは存在します。');

        const iframe = document.createElement('iframe');
        iframe.style.visibility = 'hidden';
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        document.body.appendChild(iframe);

        // 2. iframe に HTML を書き込む
        iframe.contentDocument!.open();
        iframe.contentDocument!.write(editorTextarea.value);
        iframe.contentDocument!.close();

        const win = iframe.contentWindow!;
        const docN = iframe.contentDocument!;
        setContext(win, docN);
        try {
            console.log('[UI] 3. htmlToFigmaを呼び出します...');
            // @ts-ignore
            const res = await htmlToFigma('#container');
            console.log('[UI] 4. htmlToFigmaが成功しました。結果:', res);

            console.log('[UI] 5. sendToFigmaを呼び出します...');
            sendToFigma(res);
            console.log('[UI] 6. Figmaへの送信が要求されました。');
        } catch (error) {
            // ★UI用コンソールで確認★
            console.error(
                '[UI] ERROR: htmlToFigmaの変換中にエラーが発生しました:',
                error
            );
        }
    };
    sendButton.addEventListener('click', convertToFigma);
});

const sendToFigma = (layers: LayerNode) => {
    parent.postMessage(
        {
            pluginMessage: {
                type: 'import',
                data: {
                    layers,
                },
            },
        },
        'https://www.figma.com'
    );
};
