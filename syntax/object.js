var member = ['egoing', 'k8805', 'hoya']; //배열의 리터럴 : []
console.log(member[1]);

var i = 0;
while(i < member.length){
    console.log('array loop', member[i]);
    i = i + 1;
}

var roles = {'programmer':'egoing', 'disigner' : 'k8805', 'manager': 'hoya'};
console.log(roles.disigner); //k8805

for(var name in roles){
    console.log('object => ',  name, ', value => ', roles[name]);
}