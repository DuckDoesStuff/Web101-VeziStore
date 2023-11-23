const convertToBase64 = (file) => {
	return new Promise((result, error) => {
		const fileReader = new FileReader();
		fileReader.readAsDataURL(file);
		fileReader.onload = () => {
			result(fileReader.result);
		}
		fileReader.onerror = (error) => {
			error(error);
		}
	})
}

module.exports = convertToBase64;