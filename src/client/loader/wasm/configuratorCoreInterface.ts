export interface EmscriptenArray<T> {
    get(index: number): T;
    push_back(element: T): void;
    resize(from: number, to: number): void;
    set(index: number, element: T): T;
    size(): number;
    clone(index: number): EmscriptenArray<T>;
    delete(index: number): void;
    deleteLater(index: number): void;
    isAliasOf(index: number): boolean;
    isDeleted(index: number): boolean;
}

export interface EmscriptenMap<K, V> {
    set: (key: K, value: V) => void;
    size: () => number;
}

export interface EmscriptenSet<T> {
    insert: (element: T) => void;
    size: () => number;
}

export declare class EmscriptenList<T> {
  public push_back(element: T): void; // eslint-disable-line
  public size(): number;
  public get(index: number): T;
}

export const enum PARAMETER_UNIT_TYPES {
    UNKNOWN_UNIT = 'unknown',
    LENGTH = 'length',
    AREA = 'area',
    ANGLE = 'angle',
    COUNT = 'count'
}

export const enum PARAMETER_KERNEL_TYPE {
    UNKNOWN = '',
    INTEGER = 'Integer',
    DECIMAL = 'Decimal',
    STRING = 'String',
    BOOLTYPE = 'Boolean',
    MATERIAL = 'Material'
}

export const enum DimensionType {
    X,
    Y,
    Z
}

export const enum Type {
    DECIMAL,
    INTEGRAL,
    MATERIAL,
    STRING,
    UNKNOWN
}

export const enum Unit {
    CM,
    InchFeet,
    MM
}

export const enum UnitStringType {
    LongUnitString,
    NoUnitString,
    ShortUnitString
}

export const enum UnitType {
    ANGLE,
    AREA,
    COUNT,
    LENGTH
}

export interface StringArray extends EmscriptenArray<string> {
}

export interface Vector2fArray extends EmscriptenArray<Vector2f> {
}

export interface FloatArray extends EmscriptenArray<number> {
}

export interface Vector3fArray extends EmscriptenArray<Vector3f> {
}

export interface LongArray extends EmscriptenArray<number> {
}

export interface DockPairToPointArray extends EmscriptenArray<DockPairToPoint> {
}

export interface DockPairToLineArray extends EmscriptenArray<DockPairToLine> {
}

export interface DimensioningArray extends EmscriptenArray<Dimensioning> {
}

export interface ComponentArray extends EmscriptenArray<Component> {
}

export interface VariableArray extends EmscriptenArray<Variable> {
}

export interface RangeArray extends EmscriptenArray<Range> {
}

export interface ParameterValueArray extends EmscriptenArray<ParameterValue> {
}

export interface ParameterArray extends EmscriptenArray<Parameter> {
}

export interface ParameterGroupArray extends EmscriptenArray<ParameterGroup> {
}

export interface PartListParameterArray extends EmscriptenArray<PartListParameter> {
}

export interface ConfigurationArray extends EmscriptenArray<Configuration> {
}

export interface PartArray extends EmscriptenArray<Part> {
}

export interface PartListArray extends EmscriptenArray<PartList> {
}

export interface PossibleChildArray extends EmscriptenArray<PossibleChild> {
}

export interface AddOnSpotArray extends EmscriptenArray<AddOnSpot> {
}

export interface PlanObjectListArray extends EmscriptenArray<PlanObjectList> {
}

export interface ParamKeyValuePairArray extends EmscriptenArray<ParamKeyValuePair> {
}

export interface ParamKeyValuePairArrayArray extends EmscriptenArray<ParamKeyValuePair[]> {
}

export interface VariantArray extends EmscriptenArray<Variant> {
}

export interface IntArray extends EmscriptenArray<number> {
}

export interface StringStringMap extends EmscriptenMap<string, string> {
}

export interface AddOnSpot {
    mask: string;
    position: Vector3f;
}

export interface Component {
    addOnSpots: AddOnSpot[];
    boundingBox: Cube;
    bounds: Vector3f;
    boxForMeasurement: Cube;
    childIds: number[];
    componentId: string;
    dimensionings: Dimensioning[];
    globalTransform: Matrix4f;
    hash: string;
    id: number;
    label: string;
    labelIsCalculated: boolean;
    parameterGroups: ParameterGroup[];
    parameters: Parameter[];
    position: Vector3f;
    possibleChildren: PossibleChild[];
    rotation: Vector3f;
    transform: Matrix4f;
    valid: boolean;
}

export interface Configuration {
    children: Configuration[];
    componentId: string;
    dockChild: string;
    dockParent: string;
    dockPosition: string;
    parameters: Map<string, string>;
}

export interface Cube {
    origin: Point;
    size: Point;
}

export interface Dimensioning {
    from: number;
    label: string;
    level: number;
    maxLevel: number;
    to: number;
    type: { value: DimensionType };
    visible: boolean;
}

export interface DockPairToLine {
    childDockId: number;
    childId: number;
    lineFrom: Vector3f;
    lineTo: Vector3f;
    parentDockId: number;
    parentId: number;
    position: Vector3f;
    positionFrom: Vector3f;
    positionTo: Vector3f;
    rotation: Vector3f;
}

export interface DockPairToPoint {
    childDockId: number;
    childId: number;
    parentDockId: number;
    parentId: number;
    position: Vector3f;
    rotation: Vector3f;
}

export interface Matrix3f {
    m: number[];
}

export interface Matrix4f {
    m: number[];
}

export interface ParamKeyValuePair {
    parameterKey: string;
    parameterValue: string;
    parameterValueTo: string;
}

export interface Parameter {
    enabled: boolean;
    group: string;
    highlighted: boolean;
    key: string;
    label: string;
    sort: number;
    type: PARAMETER_KERNEL_TYPE;
    unitType: PARAMETER_UNIT_TYPES;
    validGroups: string[];
    validRange: Range;
    validValues: ParameterValue[];
    value: string;
    valuesAreEqual: boolean;
}

export interface ParameterGroup {
    collapsed: boolean;
    key: string;
    label: string;
    sort: number;
}

export interface ParameterValue {
    label: string;
    thumbnail: string;
    value: string;
}

export interface ParametersAndParameterGroups {
    parameterGroups: ParameterGroup[];
    parameters: Parameter[];
}

export interface Part {
    articleNr: string;
    componentId: string;
    componentRuntimeIds: number[];
    count: number;
    currencySymbol: string;
    hasGeometry: boolean;
    label: string;
    labelIsCalculated: boolean;
    packageSize: number;
    parameters: PartListParameter[];
    price: number;
    retailerPrice: number;
    subpartId: number;
    valid: boolean;
}

export interface PartList {
    fullList: Part[];
    originPart: Part;
    perMainComponent: Array<PartList>;
}

export interface PartListParameter {
    key: string;
    label: string;
    sort: number;
    type: string;
    unitType: string;
    value: string;
    valueLabel: string;
    valueThumbnail: string;
}

export interface PlanObject {
    bounds: Vector3f;
    boxForMeasurement: Cube;
    id: number;
    parameterGroups: ParameterGroup[];
    parameters: Parameter[];
    rootPlanComponentId: number;
}

export interface PlanObjectList {
    configuration: string;
    configurationHash: string;
    count: number;
    partList: PartList;
    rootComponentId: string;
}

export interface Point {
    x: number;
    y: number;
    z: number;
}

export interface PossibleChild {
    componentId: string;
    group: string;
    isDefault: boolean;
    itemId: string;
    possible: boolean;
}

export interface Range {
    step: number;
    type: string;
    valueFrom: number;
    valueTo: number;
}

export interface Variable {
    key: string;
    type: string;
    value: string;
}

export interface Variant {
    componentId: string;
    parameterValues: ParamKeyValuePairArrayArray;
    parts: PartList;
}

export interface Vector2f {
    x: number;
    y: number;
}

export interface Vector3f {
    x: number;
    y: number;
    z: number;
}

export interface Kernel {
    useHDGeometry(shouldUse: boolean) : void;
    useEnvironmentGeometry(shouldUse: boolean) : void;
    setLogLevel(level: number) : void;
    loadConfiguration(conversationId: number, serializedConfiguration: string, bounding: Vector3f) : void;
    loadFreeFlyingConfiguration(conversationId: number, serializedConfiguration: string) : void;
    loadComponentDefinition(conversationId: number, serializedComponent: string) : void;
    loadComponent(conversationId: number, serializedComponent: string, configuration: Configuration, parentId: number) : void;
    loadedSubComponent(parentId: number, subComponentId: string, componentId: string, serializedComponent: string) : void;
    loadPlainComponent(conversationId: number, componentId: string, serializedComponent: string) : void;
    saveConfiguration(planObjectId: number) : void;
    getComponent(planComponentId: number) : Component;
    getComponentParameters(planComponentId: number) : ParameterArray;
    setComponentParameter(conversationId: number, key: string, value: string) : void;
    getCommonPlanComponentParameters(somePlanComponentIds: LongArray) : ParametersAndParameterGroups;
    setPlanComponentParameters(somePlanComponentIds: LongArray, key: string, value: string) : void;
    dockComponent(id: number, dockId: number, parentId: number, parentDockId: number) : void;
    dockComponentWithPosition(id: number, dockId: number, parentId: number, parentDockId: number, position: Vector3f) : void;
    deleteComponent(planComponentId: number) : void;
    deletePlanComponent(planComponentId: number) : void;
    prepareForIncrementalUpdate() : void;
    doNextIncrementalUpdate() : void;
    getPartList(planComponentId: number) : PartList;
    getFullPartList() : PartList;
    getHashOfConfiguration(planObjectOrComponentId: number) : string;
    getHashOfSerializedConfiguration(serializedConfiguration: string) : string;
    getSerializedConfiguration(planObjectOrComponentId: number) : string;
    clearScene() : void;
    clearAll() : void;
    reset() : void;
    getEnvironmentVariables() : void;
    getEnvironmentVariable(key: string) : void;
    setEnvironmentVariable(key: string, value: string) : void;
    getPlannedObjects() : void;
    getPlanObjectParameters(planObjectId: number) : ParameterArray;
    setPlanObjectParameter(planObjectId: number, key: string, value: string) : void;
    deletePlanObject(planObjectId: number) : void;
    getPlanObject(planObjectId: number) : PlanObject;
    getRootPlanComponentIdFromObjectId(planObjectId: number) : number;
    getComponentId(objectOrPlanComponentId: number) : string;
    getCurrencySymbol(planComponentId: number) : string;
    getPrice(planComponentId: number) : number;
    addPriceList(priceListId: string) : void;
    resetPriceListIds() : void;
    requestPlanObjectConstruction(planComponentId: number) : void;
    requestMergedPlanObjectConstruction(planComponentId: number) : void;
    requestPlanComponentConstruction(planComponentId: number) : boolean;
    requestDeltaPlanComponentConstruction(planComponentId: number) : boolean;
    requestPlanComponentConstructionRecursive(planComponentId: number) : void;
    requestPreviewGeometry(planComponentId: number, planObjectId: number) : void;
    setMaterialsInGroup(materialGroupsVal: any) : void;
    setMaterialProperties(propertiesOfMaterials: any) : void;
    setActiveGroupInView(activeGroup: string) : void;
    setActiveGroupInViewForPlanObject(activeGroup: string, planObjectOrComponentId: number) : void;
    getPlanObjectPossibleChildren(planObjectId: number) : PossibleChildArray;
    getChildrenOfPlanObject(planObjectId: number, onlyPossibleChildren: boolean, onlyVisibleChildren: boolean) : PossibleChildArray;
    getPlanComponentPossibleChildren(planComponentId: number) : PossibleChildArray;
    getChildrenOfPlanComponent(planComponentId: number, onlyPossibleChildren: boolean, onlyVisibleChildren: boolean) : PossibleChildArray;
    deletePlanComponents(somePlanComponentIds: LongArray) : void;
    syncPlanObjectToView(conversationId: number, planObjectId: number) : void;
    getAddOnSpotsForPlanObject(planObjectId: number) : AddOnSpotArray;
    addMeshCorto(meshId: string, quality: number, typedArray: any) : void;
    requestVariantList(componentId: string, onlyArticleNr: boolean) : void;
    generateProductionServiceExport(planObjectId: number, defaultExportDefinition: string) : string;
    generateBlueOceanPoCJSON(planObjectId: number) : string;
}

export interface UnitMeasureFormatter {
    init(mmLabel: string, cmLabel: string, ftShortLabel: string, ftLongLabel: string, inchShortLabel: string, inchLongLabel: string, sqMLabel: string, sqftLabel: string, showExactValue: boolean, maxPrecision: number) : void;
    showExactValues(shouldUseExactValue: boolean) : void;
    setMaxPrecision(maxPrecision: number) : void;
    isParseableNumber(value: string) : boolean;
    isParseableUnitString(unitString: string, unit: Unit) : boolean;
    parseSquareMMValueFromUnitString(value: string, unit: Unit) : number;
    parseMMValueFromUnitString(value: string, unit: Unit) : number;
    parseNumber(value: string) : number;
    formatNumber(value: number, digit: number) : string;
    formatSquareMMValueToUnitString(value: number, unit: Unit) : string;
    formatMMValueToUnitString(value: number, unit: Unit, unitStringType: UnitStringType) : string;
    formatMMValueWithReqMaxLength(value: number, unit: Unit, reqMaxSize: number) : string;
}

export interface ConfiguratorContainer {
    StringArray : StringArray;
    Vector2fArray : Vector2fArray;
    FloatArray : FloatArray;
    Vector3fArray : Vector3fArray;
    LongArray : LongArray;
    DockPairToPointArray : DockPairToPointArray;
    DockPairToLineArray : DockPairToLineArray;
    DimensioningArray : DimensioningArray;
    ComponentArray : ComponentArray;
    VariableArray : VariableArray;
    RangeArray : RangeArray;
    ParameterValueArray : ParameterValueArray;
    ParameterArray : ParameterArray;
    ParameterGroupArray : ParameterGroupArray;
    PartListParameterArray : PartListParameterArray;
    ConfigurationArray : ConfigurationArray;
    PartArray : PartArray;
    PartListArray : PartListArray;
    PossibleChildArray : PossibleChildArray;
    AddOnSpotArray : AddOnSpotArray;
    PlanObjectListArray : PlanObjectListArray;
    ParamKeyValuePairArray : ParamKeyValuePairArray;
    ParamKeyValuePairArrayArray : ParamKeyValuePairArrayArray;
    VariantArray : VariantArray;
    IntArray : IntArray;
    StringStringMap : StringStringMap;
    Kernel : Kernel;
    UnitMeasureFormatter : UnitMeasureFormatter;
    registerConfiguratorCallback(callback: ConfiguratorCallback) : void;
    setExternalHelpers(ioContext: ConfiguratorIoContext, helper: any) : void;
    toUnit(value: number) : Unit;
    toUnitFormat(value: number) : UnitStringType;
    unregisterConfiguratorCallback(callback: ConfiguratorCallback) : void;
}



export type ConfiguratorCoreInterface = Kernel;

export interface ConfiguratorIoContext {
    log(message : string) : void;
    info(message : string) : void;
    warn(message : string) : void;
    error(message : string) : void;
}

export type EmscriptenString = any;
export type RapiId = string;
export type ConfigurationString = string;

export interface ConfiguratorCallback {    
    isReady() : void;
    loadComponent(conversationId: number, configuration: Configuration, parentId: number): void;
    loadSubComponent(parentId: number, partId: string, componentId: string): void;
    configurationLoaded(conversationId: number, objectId: number, componentId: number, hash: string, errors: EmscriptenString[]): void;
    configurationLoadingError(runtimeId: number, errors?: EmscriptenString[]): void;
    configurationSaved(conversationId: number, configuration: ConfigurationString, hash: string, rootComponentId: number): void;
    componentDefinitionLoaded(conversationId: number, componentId: number): void;
    componentDefinitionLoadingError(conversationId: number, errorMessage: string): void;
    componentConfigurationUpdated(runtimeComponentId: number, geometryChanged: boolean): void;
    componentMetaUpdated(kernelComponent: Component): void;
    componentDeleted(componentId: number): void;
    planObjectCreated(conversationId: number, planObjectId: number): void;
    planObjectUpdated(planObjectId: number): void;
    planObjectDeleted(objectId: number): void;
    planObjectConfigurationUpdated(planObjectId: number, configuration: ConfigurationString, hash: string): void;
    sceneCleared(): void;
    listOfVariants(componentId: RapiId, list: VariantArray): void;
    listOfVariantsError(dbId: RapiId, error: string): void;
    requestMaterialsInGroup(groupIds: string[]): void
    requestMaterialProperties(materialIds: RapiId[]): void
    requestExternalMesh(meshId: string, quality: number): void;
    Editor3dComponentCreated(id: number, position: Vector3f, eulerAngles: Vector3f, parentObjectRuntimeId: number, isRootComponent: boolean): void;
    Editor3dRootComponentCreated(id: number, position: Vector3f, eulerAngles: Vector3f, parentObjectId: number): void;
    Editor3dComponentDocked(componentId: number, parentId: number, componentPosition: Vector3f, componentRotation: Vector3f): void;
    Editor3dAddDockPreview(componentId: number, previewId: number): void;
    Editor3dSetPreviewPointAssociations(dockPairs: DockPairToPointArray, previewId: number): void;
    Editor3dSetPreviewLineAssociations(dockLines: DockPairToLineArray, previewId: number): void;
    Editor3dPreviewConstructionDone(componentId: number, objectId: number): void;
    Editor3dGeometryReady(id: number): void;
    Editor3dGeometryNotReady(id: number): void;
    Editor3dBeginConstruction(componentId: number, isDeltaUpdate: boolean): void;
    Editor3dEndConstruction(id: number): void;
    Editor3dAddBakedMesh(runtimeComponentId: number, materialId: string, vertices: Float32Array, indices: Int32Array, uvCoords: Float32Array, normals: Float32Array, environmentGeometry: boolean): void;
    Editor3dAddNamedMesh(runtimeComponentId: number, meshId: string, geometryId: string, materialId: string, transform: Float32Array, vertices: Float32Array, indices: Int32Array, uvCoords: Float32Array, normals: Float32Array, environmentGeometry: boolean, uvTransform: Float32Array): void;
    Editor3ChangedNamedMesh(runtimeComponentId: number, meshId: string, geometryId: string, materiadlId: string, transform: Float32Array, uvTransform: Float32Array): void;
    Editor3dRemoveNamedMesh(runtimeComponentId: number, geometryId: string): void;
    Editor3dPlanObjectConstructionDone(planObjectId: number): void;
    // Editor3dPlanObjectAddBakedMesh ?
    // Editor3dPlanObjectAddNamedMesh ?
}