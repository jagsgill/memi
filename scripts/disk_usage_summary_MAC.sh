#!/bin/bash

# Outputs tab-separated columns [filesize name type]

dir=$1
du_output=`cd "$dir" && du -sc .[^.]* *`

# http://mywiki.wooledge.org/ProcessSubstitution
f=""
while read line; 
	do
	#line=`echo "$line" | tr -s $"\t" ''`
	fd=`echo "$line" | cut -d$'\t' -f2`
	type=`file --brief "$dir"/"$fd"`
	f="$f\t$line\t$type\n"
done < <(echo "$du_output")
echo -e "$f" | column -t -s $'\t' 