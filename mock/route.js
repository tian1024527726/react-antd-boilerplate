import mockjs from 'mockjs';
import routeApi from '@/api/route';

mockjs.mock(routeApi.getAuthRoutes, 'post', {
	"requestId": "I_puSLKyIVIfk70lKU/sMlZQ==",
	"responseCode": "000000",
	"responseData": {
		'/materialDownload': { authority: ['admin', 'user'] },
	},
	"responseMessage": "处理成功",
})
