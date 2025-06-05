import 'dotenv/config';

export default ({ config }: any) => ({
    ...config,
    extra: {
        apiUrl: process.env.API_URL,
    },
});