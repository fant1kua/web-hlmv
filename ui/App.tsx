import * as leetModel                               from '../__mock__/leet.mdl'
import * as React                                   from 'react'
import { hot }                                      from 'react-hot-loader'
import DropzoneContainer, { DropFilesEventHandler } from 'react-dropzone'
import { ModelController }                          from '../lib/modelController'
import { ModelData }                                from '../lib/modelDataParser'
import { LoadingScreen }                            from './LoadingScreen'
import { Renderer }                                 from './Renderer'
import { Controller }                               from './Controller'
import { GlobalStyles }                             from './GlobalStyles'
import { Dropzone }                                 from './Dropzone'
import { BackgroundContainer }                      from './BackgroundContainer'

/** Is need to show demo */
const IS_DEMO_SHOWED = location.search.indexOf('?demo') === 0

export const App = hot(module)(() => {
  const [modelController, setModelController] = React.useState<ModelController | null>(null)
  const [modelData, setModelData] = React.useState<ModelData | null>(null)
  const [isLoading, setLoadingState] = React.useState(IS_DEMO_SHOWED)
  const [modelBuffer, setModelBuffer] = React.useState<ArrayBuffer | null>(null)

  React.useEffect(() => {
    if (IS_DEMO_SHOWED) {
      loadingDemo(leetModel)
    }
  }, [])

  /**
   * Loads demo model ans saves it to state
   */
  const loadingDemo = async (modelFile: string) => {
    setLoadingState(true)
    const resp = await fetch(modelFile)
    const buffer = await resp.arrayBuffer()
    setModelBuffer(buffer)
    setLoadingState(false)
  }

  /** Model dropping handle */
  const onDrop: DropFilesEventHandler = accepted => {
    const fileReader = new FileReader()

    fileReader.addEventListener('load', () => {
      setModelBuffer(fileReader.result as ArrayBuffer)
      setLoadingState(false)
    })

    fileReader.readAsArrayBuffer(accepted[0])
    setLoadingState(true)
  }

  return (
    <BackgroundContainer>
      {({ backgroundColor }, { setBackgroundColor }) => (
        <React.Fragment>
          <GlobalStyles backgroundColor={backgroundColor} color="#fff" />

          {modelBuffer ? (
            <React.Fragment>
              <Renderer modelBuffer={modelBuffer} setModelController={setModelController} setModelData={setModelData} />

              {modelController != null && modelData != null && (
                <Controller
                  backgroundColor={backgroundColor}
                  onBackgroundColorUpdate={setBackgroundColor}
                  modelController={modelController}
                  modelData={modelData}
                />
              )}
            </React.Fragment>
          ) : isLoading ? (
            <LoadingScreen />
          ) : (
            <DropzoneContainer onDrop={onDrop}>
              {({ getRootProps, getInputProps, isDragActive }) => (
                <Dropzone wrapperProps={getRootProps()} inputProps={getInputProps()} isDragActive={isDragActive} />
              )}
            </DropzoneContainer>
          )}
        </React.Fragment>
      )}
    </BackgroundContainer>
  )
})
