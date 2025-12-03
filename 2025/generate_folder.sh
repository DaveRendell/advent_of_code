# Usage ./generate_folder.sh 1 calorie_counting
NUMBER=$1
echo "number $NUMBER"
NAME=$2
echo "name $name"
FOLDER="${NUMBER}_$NAME"
echo "folder $FOLDER"
mkdir $FOLDER
touch $FOLDER/sample.txt
touch $FOLDER/input.txt
cp template.ts $FOLDER/main.ts
npx npmAddScript -k "day$NUMBER" -v "bun $FOLDER/main.ts \$1"
code $FOLDER/*