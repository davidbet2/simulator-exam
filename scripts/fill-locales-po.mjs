import { readFileSync, writeFileSync } from 'fs';

// Translations for new strings added in MySetsPage and EditExamPage
const translations = {
  de: {
    'Mis sets': 'Meine Sets',
    'Sets de examen que has creado.': 'Von dir erstellte Prüfungssets.',
    'Aún no has creado ningún set.': 'Du hast noch kein Set erstellt.',
    'Crear mi primer set': 'Mein erstes Set erstellen',
    'Borrador': 'Entwurf',
    'Publicado': 'Veröffentlicht',
    'Confirmar': 'Bestätigen',
    'Eliminar': 'Löschen',
    'Editar set': 'Set bearbeiten',
    'Guardar cambios': 'Änderungen speichern',
    'Volver a mis sets': 'Zurück zu meinen Sets',
    'El set no existe.': 'Das Set existiert nicht.',
    'No tienes permiso para editar este set.': 'Du hast keine Berechtigung, dieses Set zu bearbeiten.',
    'Error al cargar el set.': 'Fehler beim Laden des Sets.',
    'Importar más preguntas': 'Weitere Fragen importieren',
    'La primera fila debe ser el encabezado.': 'Die erste Zeile muss der Header sein.',
    'Sube un PDF con preguntas numeradas. Se extraen automáticamente.': 'Lade eine PDF mit nummerierten Fragen hoch. Diese werden automatisch extrahiert.',
    'Texto extraído del PDF:': 'Extrahierter Text aus dem PDF:',
    'Cargar más sets': 'Weitere Sets laden',
    'intentos': 'Versuche',
    'preguntas': 'Fragen',
  },
  fr: {
    'Mis sets': 'Mes sets',
    'Sets de examen que has creado.': 'Sets d\'examen que vous avez créés.',
    'Aún no has creado ningún set.': 'Vous n\'avez encore créé aucun set.',
    'Crear mi primer set': 'Créer mon premier set',
    'Borrador': 'Brouillon',
    'Publicado': 'Publié',
    'Confirmar': 'Confirmer',
    'Eliminar': 'Supprimer',
    'Editar set': 'Modifier le set',
    'Guardar cambios': 'Enregistrer les modifications',
    'Volver a mis sets': 'Retour à mes sets',
    'El set no existe.': 'Ce set n\'existe pas.',
    'No tienes permiso para editar este set.': 'Vous n\'avez pas la permission de modifier ce set.',
    'Error al cargar el set.': 'Erreur lors du chargement du set.',
    'Importar más preguntas': 'Importer plus de questions',
    'La primera fila debe ser el encabezado.': 'La première ligne doit être l\'en-tête.',
    'Sube un PDF con preguntas numeradas. Se extraen automáticamente.': 'Téléchargez un PDF avec des questions numérotées. Elles sont extraites automatiquement.',
    'Texto extraído del PDF:': 'Texte extrait du PDF :',
    'Cargar más sets': 'Charger plus de sets',
    'intentos': 'tentatives',
    'preguntas': 'questions',
  },
  it: {
    'Mis sets': 'I miei set',
    'Sets de examen que has creado.': 'Set di esame che hai creato.',
    'Aún no has creado ningún set.': 'Non hai ancora creato nessun set.',
    'Crear mi primer set': 'Crea il mio primo set',
    'Borrador': 'Bozza',
    'Publicado': 'Pubblicato',
    'Confirmar': 'Conferma',
    'Eliminar': 'Elimina',
    'Editar set': 'Modifica set',
    'Guardar cambios': 'Salva modifiche',
    'Volver a mis sets': 'Torna ai miei set',
    'El set no existe.': 'Questo set non esiste.',
    'No tienes permiso para editar este set.': 'Non hai il permesso di modificare questo set.',
    'Error al cargar el set.': 'Errore durante il caricamento del set.',
    'Importar más preguntas': 'Importa altre domande',
    'La primera fila debe ser el encabezado.': 'La prima riga deve essere l\'intestazione.',
    'Sube un PDF con preguntas numeradas. Se extraen automáticamente.': 'Carica un PDF con domande numerate. Vengono estratte automaticamente.',
    'Texto extraído del PDF:': 'Testo estratto dal PDF:',
    'Cargar más sets': 'Carica altri set',
    'intentos': 'tentativi',
    'preguntas': 'domande',
  },
  ja: {
    'Mis sets': '自分のセット',
    'Sets de examen que has creado.': '作成した試験セット。',
    'Aún no has creado ningún set.': 'まだセットを作成していません。',
    'Crear mi primer set': '最初のセットを作成',
    'Borrador': '下書き',
    'Publicado': '公開済み',
    'Confirmar': '確認',
    'Eliminar': '削除',
    'Editar set': 'セットを編集',
    'Guardar cambios': '変更を保存',
    'Volver a mis sets': '自分のセットに戻る',
    'El set no existe.': 'このセットは存在しません。',
    'No tienes permiso para editar este set.': 'このセットを編集する権限がありません。',
    'Error al cargar el set.': 'セットの読み込みエラー。',
    'Importar más preguntas': 'さらに質問をインポート',
    'La primera fila debe ser el encabezado.': '最初の行はヘッダーである必要があります。',
    'Sube un PDF con preguntas numeradas. Se extraen automáticamente.': '番号付きの質問を含むPDFをアップロードしてください。自動的に抽出されます。',
    'Texto extraído del PDF:': 'PDFから抽出したテキスト：',
    'Cargar más sets': 'さらにセットを読み込む',
    'intentos': '受験回数',
    'preguntas': '問題',
  },
  pt: {
    'Mis sets': 'Meus sets',
    'Sets de examen que has creado.': 'Sets de exame que criaste.',
    'Aún no has creado ningún set.': 'Ainda não criaste nenhum set.',
    'Crear mi primer set': 'Criar o meu primeiro set',
    'Borrador': 'Rascunho',
    'Publicado': 'Publicado',
    'Confirmar': 'Confirmar',
    'Eliminar': 'Eliminar',
    'Editar set': 'Editar set',
    'Guardar cambios': 'Guardar alterações',
    'Volver a mis sets': 'Voltar aos meus sets',
    'El set no existe.': 'Este set não existe.',
    'No tienes permiso para editar este set.': 'Não tens permissão para editar este set.',
    'Error al cargar el set.': 'Erro ao carregar o set.',
    'Importar más preguntas': 'Importar mais perguntas',
    'La primera fila debe ser el encabezado.': 'A primeira linha deve ser o cabeçalho.',
    'Sube un PDF con preguntas numeradas. Se extraen automáticamente.': 'Carrega um PDF com perguntas numeradas. São extraídas automaticamente.',
    'Texto extraído del PDF:': 'Texto extraído do PDF:',
    'Cargar más sets': 'Carregar mais sets',
    'intentos': 'tentativas',
    'preguntas': 'perguntas',
  },
  zh: {
    'Mis sets': '我的套题',
    'Sets de examen que has creado.': '你创建的考试套题。',
    'Aún no has creado ningún set.': '你还没有创建任何套题。',
    'Crear mi primer set': '创建我的第一个套题',
    'Borrador': '草稿',
    'Publicado': '已发布',
    'Confirmar': '确认',
    'Eliminar': '删除',
    'Editar set': '编辑套题',
    'Guardar cambios': '保存更改',
    'Volver a mis sets': '返回我的套题',
    'El set no existe.': '该套题不存在。',
    'No tienes permiso para editar este set.': '你没有权限编辑此套题。',
    'Error al cargar el set.': '加载套题时出错。',
    'Importar más preguntas': '导入更多题目',
    'La primera fila debe ser el encabezado.': '第一行必须是标题行。',
    'Sube un PDF con preguntas numeradas. Se extraen automáticamente.': '上传带有编号题目的PDF，将自动提取。',
    'Texto extraído del PDF:': '从PDF提取的文本：',
    'Cargar más sets': '加载更多套题',
    'intentos': '次尝试',
    'preguntas': '道题',
  },
};

for (const [locale, dict] of Object.entries(translations)) {
  const filePath = `src/locales/${locale}/messages.po`;
  let content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const result = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    result.push(line);

    // Check for missing msgstr (empty string "")
    const nextLine = lines[i + 1] || '';
    if (line.startsWith('msgid ') && nextLine === 'msgstr ""') {
      const msgidRaw = line.slice(6); // e.g. "Mis sets"
      // Remove surrounding quotes to get the actual string
      let msgidText;
      try {
        msgidText = JSON.parse(msgidRaw);
      } catch {
        msgidText = null;
      }

      if (msgidText && dict[msgidText]) {
        result.push(`msgstr "${dict[msgidText].replace(/"/g, '\\"')}"`);
        i++; // skip empty msgstr
      }
    }
  }

  writeFileSync(filePath, result.join('\n'), 'utf8');
  console.log(`Updated ${locale}/messages.po`);
}
