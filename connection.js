import postgres from "postgres";
import 'dotenv/config'

const sql = postgres(process.env.DATABASE_URL, {
    ssl: 'require', // Necessário para conexões seguras (Neon usa SSL)
});

export default sql;