const fs=require('fs');const dir='C:/Users/akash/Downloads/RCC-V2/logo-options';fs.mkdirSync(dir,{recursive:true});
const text=(x,y,t,size=42,font='Arial',extra='')=>`<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" ${extra}>${t}</text>`;
const opts=[
['01','Linked Heritage','#123c36','#d9bb80',`<path d="M126 30C77 3 22 34 27 82c5 44 62 63 100 32M119 51C86 30 57 53 61 80c3 28 37 42 61 22" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"/><path d="M50 112V37h28c40 0 40 43 0 43H50m28 0 43 45" fill="none" stroke="currentColor" stroke-width="7"/>`],
['02','Modern Block','#102c47','#fff',`<rect x="12" y="16" width="150" height="122" rx="18" fill="currentColor"/>${text(27,97,'RCC',49,'Arial','fill="#102c47" font-weight="900" letter-spacing="-5"')}<path d="M28 117h113" stroke="#102c47" stroke-width="4"/>`],
['03','Signature Crest','#fffaf0','#8a6434',`<path d="M87 9 151 43v53l-64 44-64-44V43Z" fill="none" stroke="currentColor" stroke-width="2"/>${text(38,98,'R',75,'Georgia','font-style="italic"')}${text(77,91,'C',48,'Georgia','font-style="italic"')}${text(105,91,'C',48,'Georgia','font-style="italic"')}`],
['04','Precision Lines','#132e2e','#a4d5bc',`<path d="M25 115V30h25c42 0 42 44 0 44H25m27 0 35 41M112 40C80 16 55 49 65 84c5 21 30 38 49 17M147 40c-32-24-57 9-47 44 5 21 30 38 49 17" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="square"/>`],
['05','Executive Serif','#f5f0e9','#283851',`${text(13,103,'RCC',74,'Georgia','font-weight="700" letter-spacing="-9"')}<path d="M20 118h127M44 128h77" stroke="currentColor" stroke-width="2"/>`],
['06','Continuous Loop','#292238','#e3c5aa',`<path d="M30 122V40c0-28 62-28 62 3 0 27-62 25-62 25l72 54M143 32c-30-32-72 9-58 47 9 25 39 40 58 19M157 52c-26-23-49 4-42 27 5 20 27 27 42 12" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`],
['07','Circular Seal','#eef3f6','#123f59',`<circle cx="86" cy="76" r="65" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="86" cy="76" r="56" fill="none" stroke="currentColor" stroke-width="1"/>${text(28,92,'RCC',45,'Georgia','font-weight="700"')}<path d="M47 109h79M65 39h43" stroke="currentColor" stroke-width="2"/>`],
['08','Cut & Connect','#173735','#ecdfc1',`${text(12,100,'RCC',67,'Arial','font-weight="900" letter-spacing="-11"')}<path d="M24 72h130" stroke="#173735" stroke-width="6"/><path d="M29 119 147 23" stroke="currentColor" stroke-width="3"/>`],
['09','Architectural','#faf8f4','#714831',`<path d="M29 119V30h33l20 22-20 22H29l54 45M119 31H96L77 51v48l19 20h23M153 31h-23l-19 20v48l19 20h23" fill="none" stroke="currentColor" stroke-width="6" stroke-linejoin="miter"/>`],
['10','Minimal Luxe','#18202c','#cfac69',`${text(18,103,'R',94,'Georgia','font-style="italic"')}${text(67,97,'C',66,'Georgia','font-style="italic"')}${text(102,97,'C',66,'Georgia','font-style="italic"')}<path d="M14 127c37-15 89-15 143-5" fill="none" stroke="currentColor" stroke-width="2"/>`]
];
let board=`<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1660" viewBox="0 0 1400 1660"><rect width="1400" height="1660" fill="#e7ebe9"/>${text(48,60,'RCC / 10 LOGO DIRECTIONS',26,'Arial','fill="#18342e" font-weight="700"')}${text(48,90,'Choose a number. Each option is an editable vector concept.',17,'Arial','fill="#556b64"')}`;
for(let i=0;i<opts.length;i++){
 const[n,label,bg,fg,mark]=opts[i];const brand=`${text(215,72,'RENGROW',25,'Arial','font-weight="700" letter-spacing="2"')}${text(215,102,'CONSULTING CREW',15,'Arial','letter-spacing="1.4"')}`;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="520" height="170" viewBox="0 0 520 170"><rect width="520" height="170" rx="16" fill="${bg}"/><g fill="${fg}" color="${fg}" transform="translate(8 8)">${mark}${brand}</g></svg>`;fs.writeFileSync(dir+'/rcc-option-'+n+'.svg',svg);
 const x=40+(i%2)*680,y=120+Math.floor(i/2)*302;
 board+=`<g transform="translate(${x} ${y})"><rect width="640" height="278" rx="18" fill="${bg}"/>${text(24,33,n+' / '+label,14,'Arial',`fill="${fg}" font-weight="700" letter-spacing="1"`)}<g transform="translate(56 72)" fill="${fg}" color="${fg}">${mark}${brand}</g></g>`;
}
board+='</svg>';fs.writeFileSync(dir+'/rcc-10-options.svg',board);
