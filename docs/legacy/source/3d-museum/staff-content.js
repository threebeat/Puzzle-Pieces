// Fictional staff ephemera. Phone numbers use the reserved 555-01xx range.
export const STAFF_NOTES=[
 {key:'staffCoffee',color:'#e8ce76',ink:'#484538',title:'LAST CUP',author:'— Jo',text:'Wash your mug. Switch off the pot.\n\nIf the spoon stands up in it, make a fresh one.\n\nThis is a break room.'},
 {key:'staffDinner',color:'#dfa8ac',ink:'#583b40',title:'LATE DINNER',author:'— M.',text:'The menu lives beside the coffee. Ask for extra chopsticks.\n\nFive meals again. There were only four of us.'},
 {key:'staffLift',color:'#a2c5d9',ink:'#314d60',title:'LOWER SERVICE',author:'— Facilities',text:'South service door. Inspection access only.\n\nWhoever keeps calling the car from below: stop.\n\nThe freight route is still quarantined.'},
 {key:'staffLabels',color:'#b8cba0',ink:'#394e38',title:'CATALOGUE CHECK',author:'— Restoration',text:'Storage B: centimetres, always.\n\nTwo brass labels now give inches. Find the originals before moving a single frame.'},
 {key:'staffProvenance',color:'#c5b8d2',ink:'#50435e',title:'ON WITHDRAWALS',author:'— Collections',text:'An acquisition number tells you when we filed a thing.\n\nIt does not tell you that we kept it.\n\nStop rehanging the rejected studies.'}
];
export const TAKEOUT={
 title:'RED LANTERN',subtitle:'CHINESE KITCHEN',phone:'(615) 555-0147',
 dishes:[['Chilli-garlic noodles','7.50'],['Sesame tofu','8.50'],['Ginger chicken','9.00'],['Vegetable fried rice','6.00'],['Pan-fried dumplings','4.25'],['Hot & sour soup','3.00']],
 note:'Jo — five portions, not four.\nLeave the extra by the south service door.\nDon’t let the driver take the lift. — A.'
};
export const STAFF_WORKS=Object.fromEntries(STAFF_NOTES.map(n=>[n.key,{title:n.title,artist:n.author.replace('— ',''),meta:'Employee break room · pinned notice',text:n.text}]));
Object.assign(STAFF_WORKS,{
 takeoutMenu:{title:'Red Lantern takeout menu',artist:'Night-shift order',meta:'Employee break room · folded menu and blue-ink note',text:TAKEOUT.dishes.map(([name,price])=>`${name} — $${price}`).join('\n')+'\n\n'+TAKEOUT.note+'\n'+TAKEOUT.phone},
 coldLabel:{title:'An unclaimed meal',artist:'Unsigned',meta:'Paper label · refrigerator',text:'THURSDAY\nCollected from B1.\nNobody signed for it.'},
 liftIsolation:{title:'SOUTH SERVICE DOOR',artist:'Facilities / level 02 access',meta:'South Arcade · inspection route to B1',text:'The working collection is below. Complete the Security checker’s training, then use the night attendant’s credential at this door.\n\nSouth service always returns to this landing. Freight requires curatorial clearance. Please keep both routes distinct.'}
});
