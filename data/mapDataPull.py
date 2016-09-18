# -*- coding: utf-8 -*-
"""
Title: mapDataPull.py

Description:
This program pulls data using the Census API for the 2014 5-Year ACS.  It 
fetches the appropriate data to calculate SNAP participation rates by county.
It then prepares the data for use by maps.js .

Input:
none

Output:
map_data.csv

Created on Wed Aug 03 18:47:12 2016

@author: Alice
"""

import urllib
import json
import pandas as pd

serviceurl = 'http://api.census.gov/data/2014/acs5?'
api_key = 'your_key_here'
variables = ['B22001_001E', 'B22001_002E', 'B22001_003E', 'B22001_006E', 
             'B22002_003E', 'B22002_016E', 'B22005A_001E', 'B22005A_002E', 
             'B22005B_001E', 'B22005B_002E', 'B22005D_001E', 'B22005D_002E', 
             'B22005I_001E', 'B22005I_002E', 'B22007_006E', 'B22007_016E', 
             'B22007_021E', 'B22007_027E', 'B22007_037E', 'B22007_042E']

# put all the variables in a comma separated string so that all of them can
# be pulled at once
varstring = 'NAME'
for var in variables:
    varstring = varstring + ',' + var
#print varstring

url = serviceurl + 'get=' + varstring + '&for=county:*'

# make API call
uh = urllib.urlopen(url)
data = json.loads(uh.read())

#print data[0]

# convert data received from API into a list of dictionaries
keys = data[0]
data_dict = []
for county in data[1:]:
    county_dict = {}
    for i in range(len(keys)):
        county_dict[keys[i]] = county[i].encode('utf_8')
    data_dict.append(county_dict)

# convert the list of dictionaries into a dataframe
df = pd.DataFrame(data_dict)
df.head()

# convert numeric columns into numbers
df[variables] = df[variables].apply(pd.to_numeric)
    
# create a fips column by concatenating state + county
df['fips'] = df['state'] + df['county']

# calculate percentages of households receiving SNAP
df['pct_snap'] = df['B22001_002E']/df['B22001_001E']
df['pct_old'] = df['B22001_003E']/(df['B22001_003E'] + df['B22001_006E'])
df['pct_child'] = df['B22002_003E']/(df['B22002_003E'] + df['B22002_016E'])
df['pct_white'] = df['B22005A_002E']/df['B22005A_001E']
df['pct_black'] = df['B22005B_002E']/df['B22005B_001E']
#df['pct_asian'] = df['B22005D_002E']/df['B22005D_001E']  # data too sparse
df['pct_hisp'] = df['B22005I_002E']/df['B22005I_001E']
#df['pct_2workers'] = (df['B22007_006E'] + df['B22007_016E'] + df['B22007_021E'])/ \
#                     (df['B22007_006E'] + df['B22007_016E'] + df['B22007_021E'] +
#                      df['B22007_027E'] + df['B22007_037E'] + df['B22007_042E'])

# write out data
df.to_csv('map_data.csv', columns = ['fips', 'pct_snap', 'pct_old', 
                                     'pct_child', 'pct_white', 'pct_black', 
                                     'pct_hisp'], 
                          index = False)
                          