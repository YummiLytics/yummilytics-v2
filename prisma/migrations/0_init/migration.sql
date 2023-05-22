BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[compCatZip] (
    [CatZipGroupkey] INT NOT NULL IDENTITY(1,1),
    [LocationKey] INT,
    [CatZipCompareZip1] VARCHAR(50),
    [CatZipCompareZip2] VARCHAR(50),
    [CatZipCompareZip3] VARCHAR(50),
    [CatZipCompareZip4] VARCHAR(50),
    [CatZipCompareZip5] VARCHAR(50),
    [CatZipCompareZip6] VARCHAR(50),
    [CatZipCompareZip7] VARCHAR(50),
    [CatZipCompareZip8] VARCHAR(50),
    [CatZipCompareZip9] VARCHAR(50),
    [CatZipCompareZip10] VARCHAR(50),
    [CatZipGroupID] VARCHAR(50),
    [CatZipCompareZips] VARCHAR(50),
    CONSTRAINT [PK_compCatZip] PRIMARY KEY CLUSTERED ([CatZipGroupkey])
);

-- CreateTable
CREATE TABLE [dbo].[compSelectedGroup] (
    [SelectedGroupKey] INT NOT NULL IDENTITY(1,1),
    [LocationKey] INT,
    [SelectedCompareCompanyKey1] INT,
    [SelectedCompareCompanyKey2] INT,
    [SelectedCompareCompanyKey3] INT,
    [SelectedCompareCompanyKey4] INT,
    [SelectedCompareCompanyKey5] INT,
    [SelectedCompareCompanyKey6] INT,
    [SelectedCompareCompanyKey7] INT,
    [SelectedCompareCompanyKey8] INT,
    [SelectedCompareCompanyKey9] INT,
    [SelectedCompareCompanyKey10] INT,
    [SelectedGroupID] VARCHAR(50),
    [SelectedCompareCompanyKeys] INT,
    CONSTRAINT [PK_compSelectedGroup] PRIMARY KEY CLUSTERED ([SelectedGroupKey])
);

-- CreateTable
CREATE TABLE [dbo].[dimCard] (
    [CardBrandName] VARCHAR(50),
    [CardKey] INT NOT NULL IDENTITY(1,1),
    CONSTRAINT [PK_dimCard] PRIMARY KEY CLUSTERED ([CardKey])
);

-- CreateTable
CREATE TABLE [dbo].[dimCategory] (
    [CatKey] INT NOT NULL IDENTITY(1,1),
    [Categories] VARCHAR(50),
    [Description] VARCHAR(50),
    CONSTRAINT [PK_dimCategory] PRIMARY KEY CLUSTERED ([CatKey])
);

-- CreateTable
CREATE TABLE [dbo].[dimCity] (
    [CityKey] INT NOT NULL IDENTITY(1,1),
    [AddressCity] VARCHAR(50),
    CONSTRAINT [PK_dimCity] PRIMARY KEY CLUSTERED ([CityKey])
);

-- CreateTable
CREATE TABLE [dbo].[dimCompany] (
    [CompanyKey] INT NOT NULL IDENTITY(1,1),
    [CompanyName] VARCHAR(50),
    [AddressNumber] VARCHAR(50),
    [AddressStreet] VARCHAR(50),
    [AddressCity] VARCHAR(50),
    [AddressState] VARCHAR(50),
    [AddressZip] VARCHAR(50),
    [RepFirstName] VARCHAR(50),
    [RepLastName] VARCHAR(50),
    [RepPhone] VARCHAR(50),
    [RepEmail] VARCHAR(50),
    CONSTRAINT [PK_dimCompany] PRIMARY KEY CLUSTERED ([CompanyKey])
);

-- CreateTable
CREATE TABLE [dbo].[dimCredit] (
    [CreditDebitKey] INT NOT NULL,
    [CreditDebit] VARCHAR(50),
    CONSTRAINT [PK_dimCredit] PRIMARY KEY CLUSTERED ([CreditDebitKey])
);

-- CreateTable
CREATE TABLE [dbo].[dimCustomer] (
    [CustomerKey] INT NOT NULL IDENTITY(1,1),
    [CustomerType] VARCHAR(50),
    CONSTRAINT [PK_dimCustomer] PRIMARY KEY CLUSTERED ([CustomerKey])
);

-- CreateTable
CREATE TABLE [dbo].[dimItem] (
    [ItemKey] INT NOT NULL IDENTITY(1,1),
    [ItemNo] VARCHAR(50),
    [ItemName] VARCHAR(50),
    [ItemType] VARCHAR(50),
    [BaseAdd] VARCHAR(50),
    CONSTRAINT [PK_dimItem] PRIMARY KEY CLUSTERED ([ItemKey])
);

-- CreateTable
CREATE TABLE [dbo].[dimLocation] (
    [LocationKey] INT NOT NULL IDENTITY(1,1),
    [CompanyKey] INT,
    [LocationID] VARCHAR(50),
    [AddressKey] INT,
    [AddressNumber] VARCHAR(50),
    [AddressStreet] VARCHAR(50),
    [AddressCity] VARCHAR(50),
    [AddressState] VARCHAR(50),
    [AddressZip] VARCHAR(50),
    [AddressRegion] VARCHAR(50),
    [Longitude] FLOAT(53),
    [Latitude] FLOAT(53),
    [Index] NCHAR(10),
    [CatZipGroupID] INT,
    [SelectedGroupID] INT,
    [CatKey] INT,
    [SegKey] INT,
    CONSTRAINT [PK_dimLocation] PRIMARY KEY CLUSTERED ([LocationKey])
);

-- CreateTable
CREATE TABLE [dbo].[dimNumber] (
    [NumberKey] INT NOT NULL IDENTITY(1,1),
    [AddressNumber] VARCHAR(50),
    CONSTRAINT [PK_dimNumber] PRIMARY KEY CLUSTERED ([NumberKey])
);

-- CreateTable
CREATE TABLE [dbo].[dimRegion] (
    [RegionKey] INT NOT NULL IDENTITY(1,1),
    [RegionName] VARCHAR(50),
    [CityKey] INT,
    CONSTRAINT [PK_dimRegion] PRIMARY KEY CLUSTERED ([RegionKey])
);

-- CreateTable
CREATE TABLE [dbo].[dimSegment] (
    [SegmentKey] INT NOT NULL IDENTITY(1,1),
    [SegmentName] VARCHAR(50),
    CONSTRAINT [PK_dimSegment] PRIMARY KEY CLUSTERED ([SegmentKey])
);

-- CreateTable
CREATE TABLE [dbo].[dimState] (
    [StateKey] INT NOT NULL IDENTITY(1,1),
    [StateName] VARCHAR(50),
    [AddressState] VARCHAR(50),
    CONSTRAINT [PK_dimState] PRIMARY KEY CLUSTERED ([StateKey])
);

-- CreateTable
CREATE TABLE [dbo].[dimStreet] (
    [StreetKey] INT NOT NULL IDENTITY(1,1),
    [AddressStreet] VARCHAR(50),
    CONSTRAINT [PK_dimStreet] PRIMARY KEY CLUSTERED ([StreetKey])
);

-- CreateTable
CREATE TABLE [dbo].[dimZip] (
    [ZipKey] INT NOT NULL IDENTITY(1,1),
    [AddressZip] VARCHAR(50),
    CONSTRAINT [PK_dimZip] PRIMARY KEY CLUSTERED ([ZipKey])
);

-- CreateTable
CREATE TABLE [dbo].[factAddress] (
    [AddressKey] INT NOT NULL IDENTITY(1,1),
    [NumberKey] INT,
    [StreetKey] INT,
    [CityKey] INT,
    [StateKey] INT,
    [ZipKey] INT,
    [Index] NCHAR(10),
    CONSTRAINT [PK_factAddress] PRIMARY KEY CLUSTERED ([AddressKey])
);

-- CreateTable
CREATE TABLE [dbo].[factItem] (
    [factItemKey] INT NOT NULL IDENTITY(1,1),
    [ItemCost] MONEY,
    [ItemKey] INT,
    [ItemPrice] MONEY,
    CONSTRAINT [PK_factItem] PRIMARY KEY CLUSTERED ([factItemKey])
);

-- CreateTable
CREATE TABLE [dbo].[factTransactions] (
    [TransactionKey] INT NOT NULL IDENTITY(1,1),
    [CompanyKey] INT,
    [PurchDate] DATE,
    [PurchTime] DATETIME,
    [TransactionID] VARCHAR(50),
    [ItemKey] INT,
    [ItemQty] INT,
    [ItemSalesPrice] MONEY,
    [AddressKey] INT,
    [CustomerKey] INT,
    [CardKey] INT,
    [LocationKey] INT,
    [CreditDebitKey] INT,
    [UniqueCustomer] VARCHAR(50),
    [AddressZip] VARCHAR(50),
    CONSTRAINT [PK_factTransactions] PRIMARY KEY CLUSTERED ([TransactionKey])
);

-- CreateTable
CREATE TABLE [dbo].[filterCustomer] (
    [NewRepeatCustomer] VARCHAR(50),
    [Type] VARCHAR(50)
);

-- CreateTable
CREATE TABLE [dbo].[SegXCat] (
    [SegXCatKey] INT NOT NULL IDENTITY(1,1),
    [SegmentKey] INT,
    [CatKey] INT,
    CONSTRAINT [PK_SegXCat] PRIMARY KEY CLUSTERED ([SegXCatKey])
);

-- CreateTable
CREATE TABLE [dbo].[sysdiagrams] (
    [name] NVARCHAR(128) NOT NULL,
    [principal_id] INT NOT NULL,
    [diagram_id] INT NOT NULL IDENTITY(1,1),
    [version] INT,
    [definition] VARBINARY(max),
    CONSTRAINT [PK__sysdiagr__C2B05B6119E6A87A] PRIMARY KEY CLUSTERED ([diagram_id]),
    CONSTRAINT [UK_principal_name] UNIQUE NONCLUSTERED ([principal_id],[name])
);

-- AddForeignKey
ALTER TABLE [dbo].[dimLocation] ADD CONSTRAINT [FK_dimLocation_dimCategory] FOREIGN KEY ([CatKey]) REFERENCES [dbo].[dimCategory]([CatKey]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[dimLocation] ADD CONSTRAINT [FK_dimLocation_dimCompany] FOREIGN KEY ([CompanyKey]) REFERENCES [dbo].[dimCompany]([CompanyKey]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[dimLocation] ADD CONSTRAINT [FK_dimLocation_dimSegment] FOREIGN KEY ([SegKey]) REFERENCES [dbo].[dimSegment]([SegmentKey]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[dimLocation] ADD CONSTRAINT [FK_dimLocation_factAddress] FOREIGN KEY ([AddressKey]) REFERENCES [dbo].[factAddress]([AddressKey]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[dimRegion] ADD CONSTRAINT [FK_dimRegion_dimCity] FOREIGN KEY ([CityKey]) REFERENCES [dbo].[dimCity]([CityKey]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[factAddress] ADD CONSTRAINT [FK_factAddress_dimCity] FOREIGN KEY ([CityKey]) REFERENCES [dbo].[dimCity]([CityKey]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[factAddress] ADD CONSTRAINT [FK_factAddress_dimNumber] FOREIGN KEY ([NumberKey]) REFERENCES [dbo].[dimNumber]([NumberKey]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[factAddress] ADD CONSTRAINT [FK_factAddress_dimState] FOREIGN KEY ([StateKey]) REFERENCES [dbo].[dimState]([StateKey]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[factAddress] ADD CONSTRAINT [FK_factAddress_dimStreet] FOREIGN KEY ([StreetKey]) REFERENCES [dbo].[dimStreet]([StreetKey]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[factAddress] ADD CONSTRAINT [FK_factAddress_dimZip] FOREIGN KEY ([ZipKey]) REFERENCES [dbo].[dimZip]([ZipKey]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[factItem] ADD CONSTRAINT [FK_factItem_dimItem] FOREIGN KEY ([ItemKey]) REFERENCES [dbo].[dimItem]([ItemKey]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[factTransactions] ADD CONSTRAINT [FK_factTransactions_dimCard] FOREIGN KEY ([CardKey]) REFERENCES [dbo].[dimCard]([CardKey]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[factTransactions] ADD CONSTRAINT [FK_factTransactions_dimCredit] FOREIGN KEY ([CreditDebitKey]) REFERENCES [dbo].[dimCredit]([CreditDebitKey]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[factTransactions] ADD CONSTRAINT [FK_factTransactions_dimItem] FOREIGN KEY ([ItemKey]) REFERENCES [dbo].[dimItem]([ItemKey]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[factTransactions] ADD CONSTRAINT [FK_factTransactions_factAddress] FOREIGN KEY ([AddressKey]) REFERENCES [dbo].[factAddress]([AddressKey]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SegXCat] ADD CONSTRAINT [FK_SegXCat_dimCategory] FOREIGN KEY ([CatKey]) REFERENCES [dbo].[dimCategory]([CatKey]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SegXCat] ADD CONSTRAINT [FK_SegXCat_dimSegment] FOREIGN KEY ([SegmentKey]) REFERENCES [dbo].[dimSegment]([SegmentKey]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

