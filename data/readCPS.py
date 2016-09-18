# -*- coding: utf-8 -*-
"""
Title: readCPS.py

Description:
This program reads the CPS Food Security Supplement (Dec 2014) fixed width
file into a pandas dataframe for easier manipulation.  It first grabs the 
names of all the variables and the columns they start and end in from the
SAS file created by the NBER for loading CPS data into SAS.

After it stores the variable names and column start/end values in lists, it 
then uses pd.read_fwf() to read the .dat file into a dataframe.

Next, it filters the dataset down to households that completed both the CPS
and the supplement interviews.  It also extracts only the relevant columns
needed for further analysis and writes out the filtered down dataframe to a 
csv file.

Finally, it prepares the dataset used by fi_plots.js .

Inputs: 
cpsdec2014.sas
dec14pub.dat

Outputs:
cps_supp.csv
foodinsecure.csv

Created on Sun Jul 17 15:55:01 2016

@author: Alice Feng
"""
import numpy as np
import pandas as pd

# read in the SAS file so we can extract the variable names and start and end 
# positions of each variable
# (the reason we don't just use the width is that the data is not contiguous - 
#  there are some filler spaces in the data file)
sasfile = open('CPS Food Security Supplement Dec 2014/cpsdec2014.sas', 'r')
names = []
colspecs = []

for line in sasfile:
    if len(line.split()) > 0 and line.split()[0][0] == '@':
        names.append(line.split()[1])
        start = int(line.split()[0][1:]) - 1  # subtract 1 because Python starts
                                              # the first column at 0, not 1
        length = line.split()[2].split(".")[0]
        if length[0] == '$':
            colspecs.append((start, start + int(length[1:])))
        else:
            colspecs.append((start, start + int(length)))

sasfile.close()

# read the CPS file into a dataframe
cps = pd.read_fwf('CPS Food Security Supplement Dec 2014/dec14pub.dat', 
                   colspecs = colspecs, header = None, names = names)

cps.head()

# filter down to households that completed the supplement interview
# and extract only the columns we need
supp = cps[(cps.hrsupint == 1) & (cps.hrintsta == 1)]

# extract only the columns of interest
supp = supp.loc[:, ['hrhhid', 'hryear4', 'hefaminc', 'hrnumhou', 'hrhhid2', 
                   'hets8o', 'hes8b', 'hes9', 'hesp1', 'hess1', 'hess2', 
                   'hess3', 'hess4', 'hesh2', 'hesh3', 'hesh4', 'hessh1', 
                   'hesc3', 'hesc4', 'hhsupwgt', 'hrfs12m1']]
                         
# filter down to unique household rows (since questions are asked at the 
# household level but the data is at the person level)
supp_hhlds = supp.drop_duplicates(['hrhhid', 'hrhhid2'], keep='first')

# write out filtered down dataframe to csv
supp_hhlds.to_csv('cps_supp.csv')






# read the data in from csv (to skip reading in the .dat file)
supp_hhlds = pd.read_csv('cps_supp.csv')

# get total number of households in the US from the Census Bureau
# https://www.census.gov/quickfacts/table/HSD410214/00
hhlds = 116211092

# number of households that would need to spend more to buy enough food to 
# meet needs (HES8B)
supp_hhlds['hes8b'].value_counts()
spendmore = sum(supp_hhlds.hhsupwgt[supp_hhlds.hes8b == 1])/10000
pctspendmore = float(spendmore)/hhlds  # 0.155

# number of households that tried to make food or food money go further (HES9)
supp_hhlds['hes9'].value_counts()
further = sum(supp_hhlds.hhsupwgt[supp_hhlds.hes9 == 1])/10000
pctfurther = float(further)/hhlds    # 0.259

# number of households that received SNAP in past 12 months (HESP1)
supp_hhlds['hesp1'].value_counts()
snap = sum(supp_hhlds.hhsupwgt[supp_hhlds.hesp1 == 1])/10000
pctsnap = float(snap)/hhlds         # 0.112

# number of households that don't have enough to eat (HESS1)
supp_hhlds['hess1'].value_counts()
notenough = sum(supp_hhlds.hhsupwgt[(supp_hhlds.hess1 == 3) | 
                (supp_hhlds.hess1 == 4)])/10000
pctnotenough = float(notenough)/hhlds    # 0.057

# number of households worried food would run out before they got money to
# buy more (HESS2)
supp_hhlds['hess2'].value_counts()
runout = sum(supp_hhlds.hhsupwgt[(supp_hhlds.hess2 == 1) | 
                                  (supp_hhlds.hess2 == 2)])/10000
pctrunout = float(runout)/hhlds   # 0.200

# number of households that didn't have enough food or money to buy more 
# (HESS3)
supp_hhlds['hess3'].value_counts()
nofood = sum(supp_hhlds.hhsupwgt[(supp_hhlds.hess3 == 1) |
                                  (supp_hhlds.hess3 == 2)])/10000
pctnofood = float(nofood)/hhlds     # 0.165

# number of households that couldn't afford to eat balanced means (HESS4)
supp_hhlds['hess4'].value_counts()
balanced = sum(supp_hhlds.hhsupwgt[(supp_hhlds.hess4 == 1) |
                                    (supp_hhlds.hess4 == 2)])/10000
pctbalanced = float(balanced)/hhlds    # 0.158

# number of households that cut size of meals or skipped meals because there
# wasn't enough money for food (HESH2)
supp_hhlds['hesh2'].value_counts()
cutmeals = sum(supp_hhlds.hhsupwgt[supp_hhlds.hesh2 == 1])/10000
pctcutmeals = float(cutmeals)/hhlds    # 0.092

# number of households that ate less because not enough money for food (HESH3)
supp_hhlds['hesh3'].value_counts()
ateless = sum(supp_hhlds.hhsupwgt[supp_hhlds.hesh3 == 1])/10000
pctateless = float(ateless)/hhlds    # 0.094

# number of households that were hungry but didn't eat because there wasn't
# enough money for food (HESH4)
supp_hhlds['hesh4'].value_counts()
hungry = sum(supp_hhlds.hhsupwgt[supp_hhlds.hesh4 == 1])/10000
pcthungry = float(hungry)/hhlds    # 0.051

# number of households that did not eat for a whole day because there wasn't
# enough money for food (HESSH1)
supp_hhlds['hessh1'].value_counts()
noeat = sum(supp_hhlds.hhsupwgt[supp_hhlds.hessh1 == 1])/10000
pctnoeat = float(noeat)/hhlds    # 0.019

# number of households that received emergency food from a church, food pantry,
# or food bank (HESC3)
supp_hhlds['hesc3'].value_counts()
foodbank = sum(supp_hhlds.hhsupwgt[supp_hhlds.hesc3 == 1])/10000
pctfoodbank = float(foodbank)/hhlds    # 0.058

# number of households that ate meals at a soup kitchen or shelter (HESC4)
supp_hhlds['hesc4'].value_counts()
soupkitchen = sum(supp_hhlds.hhsupwgt[supp_hhlds.hesc4 == 1])/10000
pctsoupkitchen = float(soupkitchen)/hhlds    # 0.006

# number of food insecure households (HRFS12M1)
supp_hhlds['hrfs12m1'].value_counts()
insecure = sum(supp_hhlds.hhsupwgt[(supp_hhlds.hrfs12m1 == 2) | 
                                    (supp_hhlds.hrfs12m1 == 3)])/10000
pctinsecure = float(insecure)/hhlds    # 0.150


# create final dataset
yesno = np.array(['yes', 'no'])
foodinsecuredat = pd.DataFrame({'pctspendmore': np.repeat(yesno, [16, 100-16]),
                                'pctfurther': np.repeat(yesno, [26, 100-26]),
                                'pctnotenough': np.repeat(yesno, [6, 100-6]),
                                'pctrunout': np.repeat(yesno, [20, 100-20]),
                                'pctnofood': np.repeat(yesno, [17, 100-17]),
                                'pctbalanced': np.repeat(yesno, [16, 100-16]),
                                'pctcutmeals': np.repeat(yesno, [9, 100-9]),
                                'pctateless': np.repeat(yesno, [9, 100-9]),
                                'pcthungry': np.repeat(yesno, [5, 100-5]),
                                'pctnoeat': np.repeat(yesno, [2, 100-2]),
                                'pctfoodbank': np.repeat(yesno, [6, 100-6]),
                                'pctsoupkitchen': np.repeat(yesno, [1, 100-1]),
                                'pctinsecure': np.repeat(yesno, [15, 100-15])
                                })
                                
foodinsecuredat.to_csv('foodinsecure.csv', index = False)