import * as vscode from 'vscode';
import GoogleTranslator, {
    TranslateItem
} from 'google-translate-unlimited-api';
import { writeSync } from 'clipboardy';

let opc: vscode.OutputChannel;

function translate2cn() {
    return vscode.commands.registerCommand('translate.cn', async () => {
        await translate('zh-CN', '翻译：请输入英文');
    });
}

function translate2en() {
    return vscode.commands.registerCommand('translate.en', async () => {
        await translate('en', '翻译：请输入中文');
    });
}

async function translate(to: string, msg: string) {
    if (!opc) {
        opc = vscode.window.createOutputChannel('m-translator');
    }
    const word = await vscode.window.showInputBox({
        password: false,
        ignoreFocusOut: true,
        placeHolder: msg,
        prompt: ''
    });
    const google = new GoogleTranslator({ to });
    let translateResult: TranslateItem[] = null;
    try {
        translateResult = await google.translate(word);
    } catch (e) {}
    if (translateResult) {
        const items = translateResult.map(i => {
            return {
                description: i.type,
                label: i.value,
                detail: i.exp
            };
        });
        const select = await vscode.window.showQuickPick(items, {
            canPickMany: false,
            ignoreFocusOut: true,
            matchOnDescription: true,
            matchOnDetail: true,
            placeHolder: '按"Enter"以复制或按"Esc"以取消'
        });
        if (select) {
            writeSync(select.label);
            opc.appendLine(`${select.label}:${select.detail}`);
            opc.show();
        }
    }
}

export default {
    translate2cn,
    translate2en
};
