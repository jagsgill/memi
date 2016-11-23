#!/bin/bash

# Outputs tab-separated columns [filesize name type]
dir=$1
if [ -d "$dir" ]
then
	du_entries=`cd "$dir" && du -s .[^.]* *` # works in bash, not in zsh - glob mismatch

	# http://mywiki.wooledge.org/ProcessSubstitution
	f=""
	if [ "$(ls -A $dir)" ]
	then
		while read line;
		do
			line=`echo "$line" | tr -s $"\t" ':'`
			fd=`echo "$line" | cut -d':' -f2`
			type=`file --brief "$dir"/"$fd"`
			f="$f$line:$type\n"
		done < <(echo "$du_entries")
	fi
	echo -e "$f"
	# echo -e "$f" | column -t -s':' # for inspecting output

	du_total=`cd "$dir" && du -s`
	read -r first _ <<< "$du_total"
	echo "$first:$dir:<<TOTAL>>"
else
	echo "DIR_NOT_EXIST"
fi
