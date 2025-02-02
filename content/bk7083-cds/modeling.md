---
tags: 
date: 2025-01-23
published: 2025-02-02
updated: 2025-02-02
title: Modeling
copyright: Dinu Blanovschi, Bas Star, Kilian Berndt, Sheila Kuijper
growth-stage: evergreen
private: true
copyrightYears: 2024-2025
---

## Envelope shaping

### Voxel Grid

Our initial voxel size is 3m×3m×3m. This size is suitable for running the simulations and it is the size that complies with our minimal height requirements. It also allows us to play with double heights for spaces like the library.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXc39U2xRG6yYiPTXB1pGukgnaY0S4a4FLZpBWPfSjzyDCgMgeX5NsnbVQ1AyJoPOXfdF2dDh50CIKcvaCSRDZQC9hUDLVo4CoH6BnqQph__Ghe6ycVl8ZFma-V7-UgHLh1YsXLleQ?key=AduABwTd9Q0Y8V4TClB1rKg9)

### Restrictions

One of the requirements of the design brief is to leave space for the Biergarten. In addition, there should be enough room for trucks to unload their goods to the stores that surround our building. We created these roads and a placeholder for the Biergarten to remove those voxels from our voxel cloud.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXfAB-6jRirqDAJN2PgX8YWEqxbd9KPQbEbbIPrDhFSwdGI56jDLEBEBGnUqBU1bdM4SgrWOKodqvmB-vWxJp7R5KTbN17fFy05LMMPEVeHrjniI4CLB0vZS_ZINxdTInmMViKde?key=AduABwTd9Q0Y8V4TClB1rKg9)![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXceAssomJcmknbYGl7FIB6dEOYSjbSaRij80C26y2ZNX-V4aESGB0m31HHz_N89a37Bz80l06-zyDipwnUqA12sDVc2v6mJ4fsi6dzeaq_3aLLjIX50bh9u7qtYTOCY47DF9guFXQ?key=AduABwTd9Q0Y8V4TClB1rKg9)

### Design Choices

We decided that we wanted a market place separate from the building. However, the market place will be connected with stairs to the main building. This separate but connected building will have a green roof that can be used as hang-out space. Besides, we want to preserve the trees that are already there. 

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXd2JgJ0eBZSXIykDWrOWXp95LFwTK07aURSx9tY7rhpzbhLSuyAlrYFWZ6aSYrsHTT9ivdW26_7FfCmERoYRsvqHOsw2Gh6AcwKrLhgkb_G7zKxSG40lgrH1vNOeWmSHWVn4dSC2A?key=AduABwTd9Q0Y8V4TClB1rKg9)![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXfNT2iTnZMarnbl9qi5WokllcuJ7kD55vuRq0My_cxy1GiSfFlzdRQ6lwMKZzX6kjPZWeLE_oXWXqFOxxpX9tQaZF2GInHhLAJ1ZDBBNvcIxwhDhthulmAOj9Wxu4hfMWrHVzAt?key=AduABwTd9Q0Y8V4TClB1rKg9)

  

## Analyses

### Shadow Casting Analysis

We want to make sure that our building is not obstructing light in the surrounding areas. The shadow casting analysis uses the input of the surrounding buildings from the 3D BAG ([https://3dbag.nl/en/viewer](https://3dbag.nl/en/viewer)) viewer, the voxel cloud after the restrictions and design choices are implemented and the data imported from Sunearthtools website ([https://www.sunearthtools.com/](https://www.sunearthtools.com/)) for the sun path of 2024 and of the day with least amount of sun hours (19 February). The sun's path determines the direction of light. Therefore, the opposite direction is the direction of the shadow. The voxel is deleted if the ratio is above 0.75. This is calculated as follows: ratio = 1- voxel value for lighting.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXf0NygV6uddTafCQPTCgttdpZfqkmlHxEk31oPntxgGwSs4xvIK7su9o8dFpghyZCsc2E_I0bpTkJMb9r8ns1Wo-sp6eXHD8f9NbOuZ5mMKl9BGwAxOLRFYVs8Se_G3WMQ3R0MZ?key=AduABwTd9Q0Y8V4TClB1rKg9)![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXdJVCyzXpiUMI0RJyLHqTpvgPLbUEAIiLZKjsmA4Q7EknQ7X_NVjumc0ipEYOFR-3PPfpPJQWlbC2rSYsDWFso_-jscB8v3Yuf_5CWbJixyigLoiR9F7jj7fAQAZSIwPJTSR9h_pQ?key=AduABwTd9Q0Y8V4TClB1rKg9)

  

### Elevation analysis

Next in our workflow, we conducted two distance analyses. The first analysis we looked at the elevation from the ground. We need this analysis for placing the assisted elderly units to the ground.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXeYkITRc7z3Py5-_ixBoSCpbDwRDeABvt4Ox0lduqCxR01XdECt_PJXadeuVQV2SVRE1NUPmxDIbIdh_ZmV01KXpQGoznqkeA0tmTPh1LXAu_mEu21AZzrXvJJbMn8oTXn7GEODwQ?key=AduABwTd9Q0Y8V4TClB1rKg9)![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXeUSotQkUAncgtvXaLaXhwk1kASR5VdzWB7qFmmiGOssFBrVaywMk5PBVza0xGHN6e4S0lb1O8L2LtFxU0tV084Ci4M5Jx290yRxGwGEMzPiRroYNjL5_N6zXXue3PO-SdG_lEfaA?key=AduABwTd9Q0Y8V4TClB1rKg9)

  

### Distance to Entrance Analysis

In the second analysis, we looked at the distance to the entrances. This is important for enhancing accessibility when placing the assisted elderly units.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXeEYdGnPISQkanUJ-gOZENLCGYnkSI8_jB49W4iTs9AQAIYo8i62LOqaGHkroptNp9kpgBXLUkYeJN8S6bAnbAsBfc7-Y-_JVY7t_da9ERIblj380M6ozKbr9-EQYZUiZHTZrYGtA?key=AduABwTd9Q0Y8V4TClB1rKg9)![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXc36TUkN2pr1hqr8j7ieBrvApQoqKIez-wj7n-LGMfSiRsCIK_uDTjEFdLa2_D6thN_6TYsCpQE0w6B-7f9jYOcaSjID1DwQtFoShv8HxOnQj1riyTH3yhy6h8HJJSyfKShrN0RVQ?key=AduABwTd9Q0Y8V4TClB1rKg9)

### Sunlight Analysis

The sunlight analysis indicates the amount of sun-hours each voxel receives. We used the same data as for the shadow analysis. The direction of sunlight is determined. Then we analyze if the rays get blocked or not by the surroundings. Finally, we can determine how many hits each voxel gets. Based on the threshold of the minimum amount of sun hours a voxel needs to receive, we delete the voxels that receive less than this threshold. 

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXcjY9kUMAYUghpdi5mhDCYjqU_wyvRMQa0uBvvCsn4kByGIQhgYFgV1VJVtDVtO1FpT_vlXawS6rYwb4EHejeOsjxgbiYIUQFGgTT9m3_QiCmPZ_rFyU7RLoDRGb991Hn9SMP3gAA?key=AduABwTd9Q0Y8V4TClB1rKg9)![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXcnw8ahfss8noKCTGChzoErt8AKlUZR5S68_KVQIrNI5kqfOpZz5yqeACyTva30vE3jDGwIb8sg3GJnxht3M76N40VXPxSGvMeK9sfxe4CI9r1qEvOV-Nv-DFKbr5sU0n11OKbudw?key=AduABwTd9Q0Y8V4TClB1rKg9)

### Daylight Analysis

The sunlight analysis indicates the amount of light each voxel receives from the sky. This is taken from the Oasis project of a previous year. A sky is represented by points that are created from a sphere. 

  

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXfnWxi5rt7sDrCVKyvokCV_D2JhI8P0gNlxLXh6HAGzINlei2PSTkoGqTuJuSAGmjmn2pZW6lk1xfhYvSIy0F2nhGKBuI6AWBRXFwSvAZFS56TmQK_sLNGiZx9w_7QYPR4ekkN6KA?key=AduABwTd9Q0Y8V4TClB1rKg9)![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXfgvj16CdtOeHLhosSawT9bmzaEZaHlQFJZVrsYh59IfErXsHtPInX77HdPV-ceg7hgWrSFgN87tablEUkSkS47e3Le7GwgV5bWsP3qqq9_nGNJx_1ry74BMfEPgKJDi-nT3Jg-XQ?key=AduABwTd9Q0Y8V4TClB1rKg9)

### Viewpoint Analysis

The viewpoint analysis is based on the number of points that have an unobstructed way to the points from the sky. It is an indicator to determine if you have a nice view from the unit.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXc-JmAWXNv5FtMAeNNvExQ6bgZXe437z_472WAVuXYsPiap3xPVwaGhordckis1Qr8P5nntsLtWfodzUIbHxiMefYRUf_gYILojCsh4rKkUbpYZuUDjpGbyVW8GIsMizYYi4sNgoA?key=AduABwTd9Q0Y8V4TClB1rKg9)![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXd5qetl6e4ibwvmbuqbffJAngQXJ7mR_qAkP5_oYhbpp4wscGroiUf0CSoKlaSbdRt0WdJceYglGD5nrsOLFf4Qe9-4GnaqEk7Hml3JWonTPV-0pSiznhRlX9jxhW88UFO-nkkU6g?key=AduABwTd9Q0Y8V4TClB1rKg9)

  

### Wind Analysis

The wind analysis determines if our building creates any wind pollution. The analysis goes as follows. This is to determine the wind speed…

## Growing and Grouping Algorithm

The growing algorithm places the functions in the best possible positions in our building. The algorithm calculates scores based on the predetermined weights from our program requirements document and the results of each of the analyses for each voxel. We select seed points based on the adjacency matrix and our defined wishes for program placement. In our case, this was done 10 times to place all the seed points for the programs which were divided over our small building and main building. 

  

Next, at every step of the loop, the algorithm finds a voxel around a function of the seed point with the highest scores for a specific function and expands the function to those voxels.

The algorithm stops when the functions reach the number of voxels needed or when they are surrounded by other functions that they cannot grow anymore. 

We found that we had some unused voxels left and added another step to expand the functions that had still room to grow.

  

As previously mentioned we started with a voxel size of 3m×3m×3m. However, we decided to base our voxel size on the Golden Ratio which is 2m×2.80m×3.20m [SOURCE]. This ratio is also a multiple of 40cm, which represents a chair. The advantage is that there are a lot of configurations possible in interior design [SOURCE]. Initially, we calculated the number of voxels needed for every function and let the growing algorithm work within these bounds. However, after the final feedback, we updated this algorithm to form the building based on the outputs of all the analyses.

  

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXdANNY_sO2frDilEaYEj7ug2bX5feNvjJbKSvVaCcHrYEtAkGaZt1rZj82c9YohfYjQmXxH-r9nW_fTvXDgaz5es_Yih0Avqw1_K3fesVE0w16bqSmrrLndl8c9ZFZ53PWloi-22w?key=AduABwTd9Q0Y8V4TClB1rKg9)![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXeVYw-fM0ni_gh2H0UXudAxIA2ZfKyk-ofMF-FoFaA0eIWXd8lE2Ll1BMCm4rkJEeZ3kZr12Bq1ZcVnXJA1gUZNPu1cTbncyar3P58mQbg2VRcai9alMq9x4YmkGA-GAA4mbI80Kg?key=AduABwTd9Q0Y8V4TClB1rKg9)

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXfqI4vrXuTUiP3WhHdp_3XtSJI-HJjcBfDmBTuYzoUTJ_6OedfIMxp-V6_utvHAtDlrujK4HzdUC1FCp9D3Xt4iHoJT3WUuzwWSaMv6PjOSCV9g3bDwP6PJMquOrBIPQHpg95HH?key=AduABwTd9Q0Y8V4TClB1rKg9)

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXeg8xyFGHm06pj_ieu8nVtarMEONwPdwP8sYSr-dGHo-zhZ3ERKoY-bYe4g2DgVKrf7EkH12xTw1AbtPgXoGHfW8lp9GHgtB9OZaG8JSIQk7Gkf9F-ZQdD9in9nxCXTGuCUzfmndQ?key=AduABwTd9Q0Y8V4TClB1rKg9)

  

[maybe add some of the challenges faced when creating it? or feel free to add on to this]
