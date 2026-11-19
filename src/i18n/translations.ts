export type AppLanguage = 'auto' | 'ja' | 'en' | 'es' | 'zh';

export type MessageKey =
  | 'appName'
  | 'tabHome'
  | 'tabSettings'
  | 'paint'
  | 'reset'
  | 'undo'
  | 'redo'
  | 'save'
  | 'share'
  | 'grid'
  | 'axes'
  | 'labels'
  | 'regions'
  | 'functions'
  | 'addFunction'
  | 'settings'
  | 'language'
  | 'languageAuto'
  | 'languageJa'
  | 'languageEn'
  | 'languageEs'
  | 'languageZh'
  | 'album'
  | 'viewAlbum'
  | 'albumEmpty'
  | 'downloadImage'
  | 'downloadedToPhotos'
  | 'copyImage'
  | 'copiedImage'
  | 'reEdit'
  | 'reEditUnavailable'
  | 'deleteImage'
  | 'deleteImageConfirm'
  | 'exportEmpty'
  | 'exportFailed'
  | 'exportAlbum'
  | 'importAlbum'
  | 'deleteAlbum'
  | 'importOverwrite'
  | 'importAppend'
  | 'importing'
  | 'info'
  | 'howToPlay'
  | 'privacyPolicy'
  | 'contact'
  | 'adPlaceholder'
  | 'savedToAlbum'
  | 'savedToAppAlbum'
  | 'saveFailed'
  | 'shareFailed'
  | 'permissionNeeded'
  | 'deleteConfirm'
  | 'exportDone'
  | 'importDone'
  | 'cancel'
  | 'howToTitle'
  | 'howToBody'
  | 'paintColorCount'
  | 'paintRandom'
  | 'strokeColor'
  | 'strokeWidth'
  | 'apply'
  | 'expressionLabel'
  | 'expressionPlaceholder'
  | 'expressionHint1'
  | 'expressionHint2'
  | 'degreeLabel'
  | 'coeffConst'
  | 'importFailed'
  | 'kindPolynomial'
  | 'kindProportional'
  | 'kindInverse'
  | 'kindAbsolute'
  | 'kindRational'
  | 'kindRoot'
  | 'kindExp'
  | 'kindLog'
  | 'kindCircle'
  | 'kindEllipse'
  | 'kindSine'
  | 'kindCosine'
  | 'kindTangent'
  | 'kindCustom'
  | 'paramPropA'
  | 'paramHShift'
  | 'paramKShift'
  | 'paramBaseB'
  | 'paramBaseBLog'
  | 'paramCenterX'
  | 'paramCenterY'
  | 'paramRadius'
  | 'paramRx'
  | 'paramRy'
  | 'paramAmplitude'
  | 'paramFrequency'
  | 'paramPhase'
  | 'paramVShift'
  | 'colorPickerTitle'
  | 'colorTheme'
  | 'colorStandard';

const ja: Record<MessageKey, string> = {
  appName: 'Function Coloring',
  tabHome: 'ホーム',
  tabSettings: '設定',
  paint: 'ペイント',
  reset: 'リセット',
  undo: '戻る',
  redo: '進む',
  save: '保存',
  share: 'シェア',
  grid: 'グリッド',
  axes: '軸',
  labels: '目盛',
  regions: '領域',
  functions: '関数リスト',
  addFunction: '＋ 関数を追加',
  settings: '設定',
  language: '言語',
  languageAuto: '自動（端末に合わせる）',
  languageJa: '日本語',
  languageEn: 'English',
  languageEs: 'Español',
  languageZh: '中文',
  album: 'アルバム',
  viewAlbum: '保存したグラフを見る',
  albumEmpty: 'まだ保存されたグラフはありません。ホームで保存ボタンを押してください。',
  downloadImage: 'ダウンロード',
  downloadedToPhotos: '端末の写真に保存しました',
  copyImage: 'コピー',
  copiedImage: 'アルバム内にコピーしました',
  reEdit: '再編集',
  reEditUnavailable: 'この画像には再編集用データがありません（新しく保存した作品から利用できます）',
  deleteImage: '削除',
  deleteImageConfirm: 'この画像を削除しますか？',
  exportAlbum: 'アルバムをエクスポート',
  importAlbum: 'アルバムをインポート',
  deleteAlbum: 'アルバムを削除',
  importOverwrite: '上書き',
  importAppend: '追加',
  importing: 'インポート中…',
  info: '情報',
  howToPlay: '使い方',
  privacyPolicy: 'プライバシーポリシー',
  contact: 'お問い合わせ',
  adPlaceholder: '広告枠（AdMob）',
  savedToAlbum: 'アルバムに保存しました',
  savedToAppAlbum: 'アルバムに保存しました',
  saveFailed: '保存に失敗しました',
  shareFailed: '共有に失敗しました',
  permissionNeeded: '写真へのアクセス許可が必要です',
  deleteConfirm: 'アルバム内のデータをすべて削除しますか？',
  exportDone: 'エクスポートしました',
  exportEmpty: 'エクスポートする画像がありません',
  exportFailed: 'エクスポートに失敗しました',
  importDone: 'インポートが完了しました',
  cancel: 'キャンセル',
  howToTitle: '使い方',
  howToBody:
    '1. 関数を追加して係数を動かします。\n2. 曲線が交差してできる領域を「ペイント」で塗ります。\n3. 領域をタップして色を変えられます。\n4. ピンチで拡大、ドラッグで移動できます。\n5. 「保存」でアプリ内アルバムへ保存できます。\n6. 「シェア」でXやLINEなどに送れます。',
  paintColorCount: '{n}色',
  paintRandom: 'ランダム（{n}色）',
  strokeColor: '線の色',
  strokeWidth: '線の太さ',
  apply: '適用',
  expressionLabel: '数式 y = f(x)',
  expressionPlaceholder: '例: sin(x)+x^2',
  expressionHint1: '使える記号: + - * / ^ ( ) sin cos tan abs sqrt log ln exp x pi e',
  expressionHint2: '組み合わせ例: sin(x)+x^2 / abs(x)*cos(x) / (x^2-1)/(x+1)',
  degreeLabel: '次数 n（0〜8）',
  coeffConst: '定数項 a₀',
  importFailed: 'インポートに失敗しました。エクスポートした JSON ファイルを選んでください。',
  kindPolynomial: 'n次関数（多項式）',
  kindProportional: '比例 y = ax',
  kindInverse: '反比例 y = a/x + b',
  kindAbsolute: '絶対値 y = a|x−h| + k',
  kindRational: '有理関数 y = (ax+b)/(cx+d)',
  kindRoot: '無理関数 y = a√(bx+c) + d',
  kindExp: '指数関数 y = a·b^x + c',
  kindLog: '対数関数 y = a·log_b(x−h) + k',
  kindCircle: '円 (x−h)²+(y−k)²=r²',
  kindEllipse: '楕円',
  kindSine: '正弦 y = a·sin(bx+c)+d',
  kindCosine: '余弦 y = a·cos(bx+c)+d',
  kindTangent: '正接 y = a·tan(bx+c)+d',
  kindCustom: '自由入力（数式）',
  paramPropA: '比例定数 a',
  paramHShift: 'h（横シフト）',
  paramKShift: 'k（縦シフト）',
  paramBaseB: '底 b (>0)',
  paramBaseBLog: '底 b (>0,≠1)',
  paramCenterX: '中心 x (h)',
  paramCenterY: '中心 y (k)',
  paramRadius: '半径 r',
  paramRx: '横半径 rx',
  paramRy: '縦半径 ry',
  paramAmplitude: '振幅 a',
  paramFrequency: '周波数 b',
  paramPhase: '位相 c',
  paramVShift: '縦シフト d',
  colorPickerTitle: '色の選択',
  colorTheme: 'テーマの色',
  colorStandard: '標準の色',
};

const en: Record<MessageKey, string> = {
  appName: 'Function Coloring',
  tabHome: 'Home',
  tabSettings: 'Settings',
  paint: 'Paint',
  reset: 'Reset',
  undo: 'Undo',
  redo: 'Redo',
  save: 'Save',
  share: 'Share',
  grid: 'Grid',
  axes: 'Axes',
  labels: 'Labels',
  regions: 'Regions',
  functions: 'Functions',
  addFunction: '+ Add function',
  settings: 'Settings',
  language: 'Language',
  languageAuto: 'Auto (device)',
  languageJa: '日本語',
  languageEn: 'English',
  languageEs: 'Español',
  languageZh: '中文',
  album: 'Album',
  viewAlbum: 'View saved graphs',
  albumEmpty: 'No saved graphs yet. Tap Save on the home screen.',
  downloadImage: 'Download',
  downloadedToPhotos: 'Saved to Photos',
  copyImage: 'Copy',
  copiedImage: 'Copied in album',
  reEdit: 'Re-edit',
  reEditUnavailable: 'No re-edit data for this image (available for newly saved works)',
  deleteImage: 'Delete',
  deleteImageConfirm: 'Delete this image?',
  exportAlbum: 'Export album',
  importAlbum: 'Import album',
  deleteAlbum: 'Delete album',
  importOverwrite: 'Overwrite',
  importAppend: 'Append',
  importing: 'Importing…',
  info: 'Info',
  howToPlay: 'How to use',
  privacyPolicy: 'Privacy Policy',
  contact: 'Contact',
  adPlaceholder: 'Ad slot (AdMob)',
  savedToAlbum: 'Saved to album',
  savedToAppAlbum: 'Saved to album',
  saveFailed: 'Failed to save',
  shareFailed: 'Failed to share',
  permissionNeeded: 'Photo library permission is required',
  deleteConfirm: 'Delete all album data?',
  exportDone: 'Export complete',
  exportEmpty: 'Nothing to export',
  exportFailed: 'Export failed',
  importDone: 'Import complete',
  cancel: 'Cancel',
  howToTitle: 'How to use',
  howToBody:
    '1. Add functions and adjust coefficients.\n2. Paint regions created by intersections.\n3. Tap a region to pick a color.\n4. Pinch to zoom, drag to pan.\n5. Save to the in-app album (Album tab).\n6. Share to X, LINE, and more.',
  paintColorCount: '{n} colors',
  paintRandom: 'Random ({n} colors)',
  strokeColor: 'Stroke color',
  strokeWidth: 'Stroke width',
  apply: 'Apply',
  expressionLabel: 'Expression y = f(x)',
  expressionPlaceholder: 'e.g. sin(x)+x^2',
  expressionHint1: 'Symbols: + - * / ^ ( ) sin cos tan abs sqrt log ln exp x pi e',
  expressionHint2: 'Examples: sin(x)+x^2 / abs(x)*cos(x) / (x^2-1)/(x+1)',
  degreeLabel: 'Degree n (0–8)',
  coeffConst: 'Constant a₀',
  importFailed: 'Import failed. Please choose a JSON file exported from this app.',
  kindPolynomial: 'Polynomial (degree n)',
  kindProportional: 'Proportional y = ax',
  kindInverse: 'Inverse y = a/x + b',
  kindAbsolute: 'Absolute y = a|x−h| + k',
  kindRational: 'Rational y = (ax+b)/(cx+d)',
  kindRoot: 'Root y = a√(bx+c) + d',
  kindExp: 'Exponential y = a·b^x + c',
  kindLog: 'Logarithm y = a·log_b(x−h) + k',
  kindCircle: 'Circle (x−h)²+(y−k)²=r²',
  kindEllipse: 'Ellipse',
  kindSine: 'Sine y = a·sin(bx+c)+d',
  kindCosine: 'Cosine y = a·cos(bx+c)+d',
  kindTangent: 'Tangent y = a·tan(bx+c)+d',
  kindCustom: 'Custom expression',
  paramPropA: 'Constant a',
  paramHShift: 'h (horizontal)',
  paramKShift: 'k (vertical)',
  paramBaseB: 'Base b (>0)',
  paramBaseBLog: 'Base b (>0,≠1)',
  paramCenterX: 'Center x (h)',
  paramCenterY: 'Center y (k)',
  paramRadius: 'Radius r',
  paramRx: 'Horizontal radius rx',
  paramRy: 'Vertical radius ry',
  paramAmplitude: 'Amplitude a',
  paramFrequency: 'Frequency b',
  paramPhase: 'Phase c',
  paramVShift: 'Vertical shift d',
  colorPickerTitle: 'Choose color',
  colorTheme: 'Theme colors',
  colorStandard: 'Standard colors',
};

const es: Record<MessageKey, string> = {
  ...en,
  tabHome: 'Inicio',
  tabSettings: 'Ajustes',
  paint: 'Pintar',
  reset: 'Reiniciar',
  undo: 'Deshacer',
  redo: 'Rehacer',
  save: 'Guardar',
  share: 'Compartir',
  grid: 'Cuadrícula',
  axes: 'Ejes',
  labels: 'Marcas',
  regions: 'Regiones',
  functions: 'Funciones',
  addFunction: '+ Añadir función',
  settings: 'Ajustes',
  language: 'Idioma',
  languageAuto: 'Auto (dispositivo)',
  album: 'Álbum',
  viewAlbum: 'Ver gráficos guardados',
  albumEmpty: 'Aún no hay gráficos. Pulsa Guardar en inicio.',
  downloadImage: 'Descargar',
  downloadedToPhotos: 'Guardado en Fotos',
  copyImage: 'Copiar',
  copiedImage: 'Copiado en el álbum',
  reEdit: 'Reeditar',
  reEditUnavailable: 'No hay datos para reeditar (disponible en obras nuevas)',
  deleteImage: 'Eliminar',
  deleteImageConfirm: '¿Eliminar esta imagen?',
  exportAlbum: 'Exportar álbum',
  importAlbum: 'Importar álbum',
  deleteAlbum: 'Eliminar álbum',
  importOverwrite: 'Sobrescribir',
  importAppend: 'Añadir',
  importing: 'Importando…',
  info: 'Información',
  howToPlay: 'Cómo usar',
  privacyPolicy: 'Política de privacidad',
  contact: 'Contacto',
  adPlaceholder: 'Espacio publicitario (AdMob)',
  savedToAlbum: 'Guardado en el álbum',
  savedToAppAlbum: 'Guardado en el álbum',
  saveFailed: 'Error al guardar',
  shareFailed: 'Error al compartir',
  permissionNeeded: 'Se necesita permiso de fotos',
  deleteConfirm: '¿Eliminar todos los datos del álbum?',
  exportDone: 'Exportación completada',
  exportEmpty: 'No hay nada que exportar',
  exportFailed: 'Error al exportar',
  importDone: 'Importación completada',
  cancel: 'Cancelar',
  howToTitle: 'Cómo usar',
  howToBody:
    '1. Añade funciones y ajusta coeficientes.\n2. Pinta las regiones de las intersecciones.\n3. Toca una región para elegir color.\n4. Pellizca para zoom, arrastra para mover.\n5. Guarda en el álbum.\n6. Comparte la imagen.',
  paintColorCount: '{n} colores',
  paintRandom: 'Aleatorio ({n} colores)',
  strokeColor: 'Color de línea',
  strokeWidth: 'Grosor de línea',
  apply: 'Aplicar',
  expressionLabel: 'Expresión y = f(x)',
  expressionPlaceholder: 'ej. sin(x)+x^2',
  expressionHint1: 'Símbolos: + - * / ^ ( ) sin cos tan abs sqrt log ln exp x pi e',
  expressionHint2: 'Ejemplos: sin(x)+x^2 / abs(x)*cos(x) / (x^2-1)/(x+1)',
  degreeLabel: 'Grado n (0–8)',
  coeffConst: 'Constante a₀',
  importFailed: 'Error al importar. Elige un JSON exportado desde esta app.',
  kindPolynomial: 'Polinomio (grado n)',
  kindProportional: 'Proporcional y = ax',
  kindInverse: 'Inversa y = a/x + b',
  kindAbsolute: 'Valor absoluto y = a|x−h| + k',
  kindRational: 'Racional y = (ax+b)/(cx+d)',
  kindRoot: 'Raíz y = a√(bx+c) + d',
  kindExp: 'Exponencial y = a·b^x + c',
  kindLog: 'Logaritmo y = a·log_b(x−h) + k',
  kindCircle: 'Círculo (x−h)²+(y−k)²=r²',
  kindEllipse: 'Elipse',
  kindSine: 'Seno y = a·sin(bx+c)+d',
  kindCosine: 'Coseno y = a·cos(bx+c)+d',
  kindTangent: 'Tangente y = a·tan(bx+c)+d',
  kindCustom: 'Expresión libre',
  paramPropA: 'Constante a',
  paramHShift: 'h (horizontal)',
  paramKShift: 'k (vertical)',
  paramBaseB: 'Base b (>0)',
  paramBaseBLog: 'Base b (>0,≠1)',
  paramCenterX: 'Centro x (h)',
  paramCenterY: 'Centro y (k)',
  paramRadius: 'Radio r',
  paramRx: 'Radio horizontal rx',
  paramRy: 'Radio vertical ry',
  paramAmplitude: 'Amplitud a',
  paramFrequency: 'Frecuencia b',
  paramPhase: 'Fase c',
  paramVShift: 'Desplazamiento vertical d',
  colorPickerTitle: 'Elegir color',
  colorTheme: 'Colores del tema',
  colorStandard: 'Colores estándar',
};

const zh: Record<MessageKey, string> = {
  ...en,
  tabHome: '首页',
  tabSettings: '设置',
  paint: '上色',
  reset: '重置',
  undo: '撤销',
  redo: '重做',
  save: '保存',
  share: '分享',
  grid: '网格',
  axes: '坐标轴',
  labels: '刻度',
  regions: '区域',
  functions: '函数列表',
  addFunction: '＋ 添加函数',
  settings: '设置',
  language: '语言',
  languageAuto: '自动（跟随系统）',
  album: '相册',
  viewAlbum: '查看已保存的图像',
  albumEmpty: '还没有保存的图像。请在主页点击保存。',
  downloadImage: '下载',
  downloadedToPhotos: '已保存到系统相册',
  copyImage: '复制',
  copiedImage: '已在相册中复制',
  reEdit: '再编辑',
  reEditUnavailable: '此图片没有再编辑数据（请重新保存作品后使用）',
  deleteImage: '删除',
  deleteImageConfirm: '删除这张图片？',
  exportAlbum: '导出相册',
  importAlbum: '导入相册',
  deleteAlbum: '删除相册',
  importOverwrite: '覆盖',
  importAppend: '追加',
  importing: '正在导入…',
  info: '信息',
  howToPlay: '使用方法',
  privacyPolicy: '隐私政策',
  contact: '联系我们',
  adPlaceholder: '广告位（AdMob）',
  savedToAlbum: '已保存到相册',
  savedToAppAlbum: '已保存到相册',
  saveFailed: '保存失败',
  shareFailed: '分享失败',
  permissionNeeded: '需要照片访问权限',
  deleteConfirm: '删除相册中的全部数据？',
  exportDone: '导出完成',
  exportEmpty: '没有可导出的内容',
  exportFailed: '导出失败',
  importDone: '导入完成',
  cancel: '取消',
  howToTitle: '使用方法',
  howToBody:
    '1. 添加函数并调整系数。\n2. 用“上色”填充交点形成的区域。\n3. 点击区域可自选颜色。\n4. 双指缩放，拖动平移。\n5. 可保存到应用内相册。\n6. 可分享到 X、LINE 等。',
  paintColorCount: '{n} 色',
  paintRandom: '随机（{n} 色）',
  strokeColor: '线条颜色',
  strokeWidth: '线条粗细',
  apply: '应用',
  expressionLabel: '表达式 y = f(x)',
  expressionPlaceholder: '例: sin(x)+x^2',
  expressionHint1: '可用符号: + - * / ^ ( ) sin cos tan abs sqrt log ln exp x pi e',
  expressionHint2: '示例: sin(x)+x^2 / abs(x)*cos(x) / (x^2-1)/(x+1)',
  degreeLabel: '次数 n（0〜8）',
  coeffConst: '常数项 a₀',
  importFailed: '导入失败。请选择从此应用导出的 JSON 文件。',
  kindPolynomial: 'n 次多项式',
  kindProportional: '正比例 y = ax',
  kindInverse: '反比例 y = a/x + b',
  kindAbsolute: '绝对值 y = a|x−h| + k',
  kindRational: '有理函数 y = (ax+b)/(cx+d)',
  kindRoot: '根式 y = a√(bx+c) + d',
  kindExp: '指数 y = a·b^x + c',
  kindLog: '对数 y = a·log_b(x−h) + k',
  kindCircle: '圆 (x−h)²+(y−k)²=r²',
  kindEllipse: '椭圆',
  kindSine: '正弦 y = a·sin(bx+c)+d',
  kindCosine: '余弦 y = a·cos(bx+c)+d',
  kindTangent: '正切 y = a·tan(bx+c)+d',
  kindCustom: '自定义表达式',
  paramPropA: '比例常数 a',
  paramHShift: 'h（水平）',
  paramKShift: 'k（垂直）',
  paramBaseB: '底数 b (>0)',
  paramBaseBLog: '底数 b (>0,≠1)',
  paramCenterX: '中心 x (h)',
  paramCenterY: '中心 y (k)',
  paramRadius: '半径 r',
  paramRx: '横半径 rx',
  paramRy: '纵半径 ry',
  paramAmplitude: '振幅 a',
  paramFrequency: '频率 b',
  paramPhase: '相位 c',
  paramVShift: '垂直平移 d',
  colorPickerTitle: '选择颜色',
  colorTheme: '主题色',
  colorStandard: '标准色',
};

export const TRANSLATIONS: Record<'ja' | 'en' | 'es' | 'zh', Record<MessageKey, string>> = {
  ja,
  en,
  es,
  zh,
};

export const CONTACT_URL = {
  ja: 'https://forms.gle/vV51vZmp9iW5qwXp9',
  en: 'https://forms.gle/GShuiT4XC5SKchJH8',
} as const;

export const PRIVACY_POLICY_URL =
  'https://harunaka726-coder.github.io/functioncoloring-privacy/';
