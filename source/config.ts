import path from "path";

module config {
	/** 插件名 */
	export const name_s = "audio-max";
	/** 插件根目录 */
	export const root_path_s = path.join(
		Editor.Project.path,
		"extensions",
		name_s
	);
	/** 入口目录 */
	export const main_path_s = path.join(__dirname, "../");
	/** 插件脚本目录 */
	export const script_path_s = path.join(__dirname, "..", "src");
	/** 插件资源目录 */
	export const resources_path_s = path.join(__dirname, "..", "res");
}

export default config;
