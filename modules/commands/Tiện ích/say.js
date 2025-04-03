module.exports.config = {
	name: "say",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "Mirai Team",
	description: "Khiến bot trả về file âm thanh của chị google thông qua văn bản",
	commandCategory: "Tiện ích",
	usages: "[ru/en/ko/ja] [Text]",
	cooldowns: 5,
	dependencies: {
		"path": "",
		"fs-extra": ""
	}
};

const { downloadFile } = require("../../../utils/index");
module.exports.run = async function ({ api, event, args }) {
	try {
		const { createReadStream, unlinkSync } = require("fs-extra");
		const { resolve } = require("path")
		var content = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
		var languageToSay = (["ru", "en", "ko", "ja"].some(item => content.indexOf(item) == 0)) ? content.slice(0, content.indexOf(" ")) : global.config.language;
		var msg = (languageToSay != global.config.language) ? content.slice(3, content.length) : content;
		const path = resolve(__dirname, 'cache', `${event.threadID}_${event.senderID}.mp3`);
		await downloadFile(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=${languageToSay}&client=tw-ob`, path);
		return api.sendMessage({ attachment: createReadStream(path) }, event.threadID, () => unlinkSync(path));
	} catch (e) { return console.log(e) };
}