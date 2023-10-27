import axios from "axios";

const buildClient = ({ req }) => {
	if (typeof window === 'undefined') {
		// we are on the server
		return axios.create({
			// this url should be changed on prod url
			baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
			headers: req.headers,
		});
	} else {
		// we are on the browser
		return axios.create({
			baseURL: '/',
		});
	}
};

export default buildClient;
