import N3 = require('n3');

interface BasicOptions {
  /**
   * A map of sources where the key is the value used in rml:source in the RML
   * rules and the value is the content of the source.
   */
  sources: Record<string, string>;
  /** Set to true to generate metadata about the execution of the rules. */
  generateMetadata?: boolean;
}

interface OptionWithAsQuad extends BasicOptions {
  /** Set to true to return the generated RDF as quads. */
  asQuads?: boolean;
}

interface OptionWithSerialization extends BasicOptions {
  /**
   * Set to a preferred serialization for the generated RDF.
   * This option can be not be combined with asQuads.
   */
  serialization?: string;
}

export type RMLExecutorOptions = OptionWithAsQuad | OptionWithSerialization;

export interface RMLExecutorResult {
  output: string | N3.Quad[];
  metadata: string | N3.Quad[];
}

declare class RMLMapperWrapper {
  /**
   * @param {string} path path of rmlmapper.jar
   * @param {string} tempFolder
   * @param {boolean} removeTempFolders
   * @param {Record<string, any>} javaVMOptions
   */
  constructor(
    path: string,
    tempFolder: string,
    removeTempFolders: boolean,
    javaVMOptions?: Record<string, unknown>
  );
  /**
   * This function returns the RDF generated by using the provided RML rules.
   * @param {string | N3.Quad} rml The RML rules are either provided as a string in an RDF format or an array of quads.
   * @param {Object} options Additional options that you can provide to this function.
   */
  execute(
    rml: string | N3.Quad,
    options?: RMLExecutorOptions
  ): Promise<RMLExecutorResult>;
}

export default RMLMapperWrapper;
