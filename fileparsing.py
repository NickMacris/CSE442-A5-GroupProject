import csv

header = True
with open("data.tsv",encoding="UTF-8",newline='') as f:
    reader = csv.reader(f,delimiter='\t',quotechar='"')
    with open("datanew.csv",'w',encoding="UTF-8",newline='') as g:
        writer = csv.writer(g)

        for line in reader:
            if header == True:
                writer.writerow(line)
                header = False
            if line[1] == "movie":
                if line[8] != "\\N":
                    writer.writerow(line)

