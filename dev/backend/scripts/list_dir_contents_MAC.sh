dir=$1
if [ -d "$dir" ]
then
  echo -e "$(ls -A1F $dir)"
else
  echo "DIR_NOT_EXIST"
fi
