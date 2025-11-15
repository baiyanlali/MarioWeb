import { New2DArray } from "../../Util.js";
import ReplayAgent from "../../agents/ReplayAgent.js";

export default class Replay {

    static async getRepAgentFromFile(filepath) {
        let content = []

        // let content = new byte[0];
        try {
            let result = await fetch(`${import.meta.env.BASE_URL}${filepath}`)
            let content = await result.blob()
            content = await content.arrayBuffer()
            let intarr = new Uint8Array(content)
            let actions = New2DArray(intarr.byteLength, 5, false)
            // console.log(actions)
            for (let i = 0; i < actions.length; i++) {
                actions[i] = this.parseAction(intarr[i]);
            }
            return new ReplayAgent(actions);
        } catch (e) {
            e.trace();
        }

    }

    static serializeAgentEvents(events) {

        let content = new Uint8Array(events.size());

        for (let i = 0; i < events.size(); i++) {
            let action = events.get(i).getActions();
            content[i] = this.serializeAction(action);
        }

        return content;
    }

    static serializeGameResult(marioResult) {
        return JSON.stringify(marioResult)
    }

    static async saveReplay(
        filepath, events
    ) {
        let content = this.serializeAgentEvents(events);
        const formData = new FormData();

        formData.append('file', content);
        formData.append('username', 'baiyan');

        // 发送POST请求
        let res = await fetch('/upload', {
            method: 'POST',
            body: formData
        })
        console.log('File uploaded successfully');
    }

    static serializeAction(action) {
        let res = 0;
        for (let i = 0; i < 5; i++) {
            if (action[i])
                res += 1 << i;
        }
        return res;
    }

    static parseAction(byteAction) {
        let action = Array(5).fill(false)
        for (let i = 0; i < 5; i++) {
            if ((byteAction & (1 << i)) !== 0) {
                action[i] = true;
            }
        }
        return action;
    }

}
