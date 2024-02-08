import Dexie from "dexie";

export const db = new Dexie("database_offline");

db.version(1).stores({
  alunos: "++id, aluno_id",
  semanas: "++id",
  dias: "++id",
  videos: "++id, semana_id, dia_id, etapa_id",
  stats_videos: "video_id, aluno_id",
});
