import { readFileSync } from "fs-extra";
import { join, resolve } from "path";
import { createApp, App, ref } from "vue";
import { assetFunc, eventEmitter } from "../resolve/assetsFunc";
import WaveSurfer from "../../../libs/wavesurfer.js";
import RegionsPlugin from "../../../libs/wavesurfer.js/dist/plugins/regions";
import element_ui, { ElLoading } from "element-plus";
import config from "../../config";
import { tr } from "element-plus/lib/locale";
import { load } from "../../main";

// import * as ElementPlusIconsVue from "@element-plus/icons-vue";
const panelDataMap = new WeakMap<any, App>();

interface css_info {
	/** css 路径 */
	url_s: string;
	/** 挂载节点 */
	parent: ParentNode;
}

export interface audioResolveConfig {
	isCompress: boolean;
	isFormat: boolean;
	isModifyVolume: boolean;
	clipStart: number;
	clipEnd: number;
	compressRatio?: number;
	format?: string;
	volumeRatio?: number;
}

module.exports = Editor.Panel.define({
	listeners: {
		show() {
			console.log("show");
		},
		hide() {
			console.log("hide");
		},
	},
	template: readFileSync(
		join(__dirname, "../../../static/template/default/index.html"),
		"utf-8"
	),
	style: readFileSync(
		join(__dirname, "../../../static/style/default/index.css"),
		"utf-8"
	),
	$: {
		app: "#app",
	},

	ready() {
		if (!this.$.app) return;
		var uuid = "";
		const submitText = ref(Editor.I18n.t("audio-max.panel.submit"));
		const outputText = ref(Editor.I18n.t("audio-max.panel.output"));
		const applyText = ref(Editor.I18n.t("audio-max.panel.apply"));
		const removeText = ref(Editor.I18n.t("audio-max.panel.remove"));
		const audioDisabled = ref(true);
		const isCompress = ref(false);
		const compressRatio = ref(32);
		const isFormat = ref(false);
		const format = ref("mp3");
		const volumeRatio = ref(1.0);
		const isModifyVolume = ref(false);
		const isOutput = ref(false);
		const outputAudioUrl = ref("");
		const compressRatioList = [
			{
				value: 32,
				label: "比特率32kbps",
			},
			{
				value: 64,
				label: "比特率64kbps",
			},
			{
				value: 80,
				label: "比特率64kbps",
			},
			{
				value: 128,
				label: "比特率128kbps",
			},
			{
				value: 256,
				label: "比特率256kbps",
			},
		];
		const formatList = [
			{
				value: "mp3",
				label: "mp3",
			},
			{
				value: "wav",
				label: "wav",
			},
			{
				value: "ogg",
				label: "ogg",
			},
			{
				value: "flac",
				label: "flac",
			},
			{
				value: "m4a",
				label: "m4a",
			},
		];

		var wavesurfer: WaveSurfer | null = null;

		const zoomRatio = ref(0);
		const clipData = {
			start: 0,
			end: 0,
		};
		const regions = RegionsPlugin.create();
		var loadingService = null!;
		const app = createApp({
			setup() {
				return {
					submitText,
					outputText,
					applyText,
					removeText,
					audioDisabled,
					zoomRatio,
					isCompress,
					compressRatioList,
					compressRatio,
					format,
					formatList,
					isFormat,
					volumeRatio,
					isModifyVolume,
					isOutput,
					outputAudioUrl,
				};
			},
			template: readFileSync(
				join(__dirname, "../../../static/template/vue/app.html"),
				"utf-8"
			),
			methods: {
				onAudioSourceChange(assetUUID: string) {
					uuid = assetUUID;
				},

				loadResolveAudio(url: string) {
					console.log("url:", url);
					isOutput.value = true;
					outputAudioUrl.value = url;
					loadingService?.close();
				},

				onApplyOutputAudio() {
					assetFunc.saveOutputAudio();
				},

				onRemoveOutputAudio() {
					this.isOutput = false;
					this.outputAudioUrl = "";
					assetFunc.removeCurOutput();
				},

				onAudioSourceSubmit() {
					const audioSourceUrl = assetFunc.findAssetFromUUID(uuid);
					audioSourceUrl.then(url => {
						if (!url) return;
						wavesurfer?.load(url);
						audioDisabled.value = false;
					});
				},
				onChangeRatio(ratio: number) {
					wavesurfer.zoom(ratio);
				},

				openLoadingPage() {
					loadingService = ElLoading.service({
						lock: true,
						text: Editor.I18n.t("audio-max.panel.resolving"),
						background: "rgba(255, 255, 255, 0.7)",
					});
				},

				load_css(info_as_: css_info[]): void {
					info_as_.forEach(v => {
						let css = document.createElement("link");
						css.rel = "stylesheet";
						css.href = v.url_s;
						v.parent.appendChild.call(v.parent, css);
					});
				},
				playAudio() {
					wavesurfer.playPause();
				},
				onAudioOutput() {
					this.openLoadingPage();
					const config: audioResolveConfig = {
						isCompress: isCompress.value,
						compressRatio: compressRatio.value,
						isFormat: isFormat.value,
						format: format.value,
						isModifyVolume: isModifyVolume.value,
						volumeRatio: volumeRatio.value,
						clipStart: clipData.start,
						clipEnd: clipData.end,
					};
					assetFunc.resolveAudio(uuid, config);
				},
				initRegion() {
					wavesurfer.on("decode", () => {
						clipData.end = wavesurfer.getDuration();
						regions.addRegion({
							start: 0,
							end: clipData.end,
							drag: true,
							resize: true,
							color: "rgba(255, 100, 0, 0.25)",
							minLength: 1,
						});
					});
					let activeRegion = null;
					regions.on("region-in", region => {
						console.log("region-in", region);
						if (activeRegion == region) activeRegion = region;
					});
					regions.on("region-out", region => {
						console.log("region-out", region);
						region.play();
					});
					regions.on("region-clicked", (region, e) => {
						e.stopPropagation();
						activeRegion = region;
						region.play();
					});
					regions.on("region-updated", region => {
						clipData.start = region.start;
						clipData.end = region.end;
						console.log("裁切片段:", clipData);
						wavesurfer.setTime(region.start);
						wavesurfer.pause();
					});
					wavesurfer.on("interaction", () => {
						activeRegion = null;
					});
				},
			},
			mounted() {
				eventEmitter.on("loadResolveAudio", this.loadResolveAudio);
				this.load_css([
					{
						parent: document.head,
						url_s:
							config.main_path_s + "/node_modules/element-plus/dist/index.css",
					},
					{
						parent: this.$el,
						url_s:
							config.main_path_s + "/node_modules/element-plus/dist/index.css",
					},
					{
						parent: document.head,
						url_s:
							config.main_path_s +
							"/node_modules/element-plus/theme-chalk/index.css",
					},
					{
						parent: this.$el,
						url_s:
							config.main_path_s +
							"/node_modules/element-plus/theme-chalk/index.css",
					},
				]);

				wavesurfer = WaveSurfer.create({
					container: this.$refs.waveform,
					waveColor: "hotpink",
					progressColor: "paleturquoise",
					cursorColor: "#57BAB6",
					cursorWidth: 4,
					height: 60,
					fillParent: true,
					barGap: 1,
					barWidth: 1,
					plugins: [regions],
				});
				this.initRegion();
			},
		});
		app.config.compilerOptions.isCustomElement = tag => tag.startsWith("ui-");
		app.use(element_ui);

		app.mount(this.$.app);
		panelDataMap.set(this, app);
	},

	beforeClose() {},

	close() {
		const app = panelDataMap.get(this);
		if (app) {
			app.unmount();
		}
	},
});
