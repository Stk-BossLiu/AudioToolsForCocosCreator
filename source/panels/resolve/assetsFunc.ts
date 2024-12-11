import { AssetInfo } from "@cocos/creator-types/editor/packages/asset-db/@types/public";
import { readFileSync } from "fs-extra";
import ffmepg from "fluent-ffmpeg";
import ffmepgPath from "@ffmpeg-installer/ffmpeg";
import path from "path";
import config from "../../config";
import fs from "fs-extra";
import { audioResolveConfig } from "../default";
import { EventEmitter } from "events";

ffmepg.setFfmpegPath(ffmepgPath.path);
export const eventEmitter = new EventEmitter();
var curInputPath: string = "";
var curOutPutPath: string = "";

export class assetFunc {
	public static findAssetFromUUID(uuid: string) {
		return Editor.Message.request("asset-db", "query-asset-info", uuid).then(
			(res: AssetInfo | null) => {
				if (!res) return;
				const abPath = res.file;
				const file = readFileSync(abPath);
				const blob = new Blob([file]);
				return URL.createObjectURL(blob);
			}
		);
	}

	public static removeCurOutput() {
		curOutPutPath = "";
		curInputPath = "";
		this.clearTempDir();
	}

	// TODO: 清理temp目录
	private static clearTempDir() {
		const tempDir = path.join(config.main_path_s, "temp");
		const removeDir = (dirPath: string) => {
			const files = fs.readdirSync(dirPath);
			files.forEach(file => {
				const filePath = path.join(tempDir, file);
				const stats = fs.statSync(filePath);
				if (stats.isDirectory()) {
					removeDir(filePath);
				} else {
					fs.unlinkSync(filePath);
				}
			});
		};
		removeDir(tempDir);
	}

	public static saveOutputAudio() {
		const targetDir = path.dirname(curInputPath);
		const targetFile = path.join(targetDir, path.basename(curOutPutPath));
		fs.renameSync(curOutPutPath, targetFile);
	}

	private static loadOutputAudio(path: string) {
		const file = readFileSync(path);
		const blob = new Blob([file]);
		const url = URL.createObjectURL(blob);
		curOutPutPath = path;
		eventEmitter.emit("loadResolveAudio", url);
	}

	public static resolveAudio(uuid: string, conf: audioResolveConfig) {
		const start = conf.clipStart;
		const duration = conf.clipEnd - conf.clipStart;
		Editor.Message.request("asset-db", "query-asset-info", uuid).then(
			(res: AssetInfo | null) => {
				const audioPath = res.file;
				const ext = path.extname(audioPath);
				const outputPath =
					path.join(config.main_path_s, "temp", path.basename(audioPath, ext)) +
					(conf.isFormat ? "." + conf.format : ext);
				console.log("音频配置:", conf);
				curInputPath = audioPath;
				const ffmepgAction = ffmepg()
					.input(audioPath)
					.setStartTime(start)
					.setDuration(duration);
				conf.isCompress && ffmepgAction.audioBitrate(conf.compressRatio);
				conf.isFormat &&
					ffmepgAction.toFormat(conf.format == "m4a" ? "mp4" : conf.format);
				conf.isModifyVolume &&
					ffmepgAction.audioFilters(`volume=${conf.volumeRatio}`);
				console.log(outputPath);
				ffmepgAction
					.output(outputPath)
					.on("end", (stdout, stderr) => {
						console.log("处理完成:", stdout);
						this.loadOutputAudio(outputPath);
					})
					.run();
			}
		);
	}
}
